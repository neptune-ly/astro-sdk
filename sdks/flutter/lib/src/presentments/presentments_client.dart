import '../astro_http.dart';
import '../models/models.dart';

class PresentmentsClient {
  final AstroHttpClient _http;
  const PresentmentsClient(this._http);

  Future<PresentedPaymentCapabilitiesResponse> capabilities() async {
    final json = await _http.get('/capabilities');
    return PresentedPaymentCapabilitiesResponse.fromJson(json as Map<String, dynamic>);
  }

  Future<Presentment> create(
    Map<String, dynamic> request, {
    String? idempotencyKey,
  }) async {
    final json = await _http.post(
      '/presentments',
      request,
      idempotencyKey == null ? null : {'Idempotency-Key': idempotencyKey},
    );
    return Presentment.fromJson(json as Map<String, dynamic>);
  }

  Future<List<Presentment>> list() async {
    final json = await _http.get('/presentments');
    final rows = json is List ? json : (json as Map<String, dynamic>)['data'] as List? ?? const [];
    return rows.map((e) => Presentment.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Presentment> get(String presentmentId) async {
    final json = await _http.get('/presentments/$presentmentId');
    return Presentment.fromJson(json as Map<String, dynamic>);
  }

  Future<Presentment> claim(String presentmentId, Map<String, dynamic> request) async {
    final json = await _http.post('/presentments/$presentmentId/claim', request);
    return Presentment.fromJson(json as Map<String, dynamic>);
  }

  Future<Presentment> cancel(String presentmentId) async {
    final json = await _http.post('/presentments/$presentmentId/cancel');
    return Presentment.fromJson(json as Map<String, dynamic>);
  }

  Future<PresentmentStatusResponse> status(String presentmentId) async {
    final json = await _http.get('/presentments/$presentmentId/status');
    return PresentmentStatusResponse.fromJson(json as Map<String, dynamic>);
  }
}
