import 'dart:convert';
import 'package:crypto/crypto.dart';

class WebhookVerifier {
  final String secret;

  const WebhookVerifier(this.secret);

  bool verify(String rawBody, String signature) {
    final provided = signature.startsWith('sha256=')
        ? signature.substring(7)
        : signature;
    final expected = _hmac(rawBody);
    return _constantTimeEquals(expected, provided);
  }

  String _hmac(String body) {
    final key = utf8.encode(secret);
    final bytes = utf8.encode(body);
    final hmac = Hmac(sha256, key);
    return hmac.convert(bytes).toString();
  }

  static bool _constantTimeEquals(String a, String b) {
    if (a.length != b.length) return false;
    var result = 0;
    for (var i = 0; i < a.length; i++) {
      result |= a.codeUnitAt(i) ^ b.codeUnitAt(i);
    }
    return result == 0;
  }

  Map<String, dynamic> parse(String rawBody) =>
      jsonDecode(rawBody) as Map<String, dynamic>;

  void handleRaw(
    String rawBody,
    String signature,
    Map<String, void Function(Map<String, dynamic>)> handlers,
  ) {
    if (!verify(rawBody, signature)) {
      throw Exception('Invalid webhook signature');
    }
    final payload = parse(rawBody);
    final event = payload['event'] as String?;
    if (event == null) return;
    handlers[event]?.call(payload);
    handlers['*']?.call(payload);
  }
}
