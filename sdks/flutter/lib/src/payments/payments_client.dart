import '../astro_http.dart';
import '../models/models.dart';

class PaymentsClient {
  final AstroHttpClient _http;
  const PaymentsClient(this._http);

  Future<PaymentSession> createSession({
    required int amount,
    required String currency,
    required Destination destination,
    String? description,
    String? reference,
    String? redirectUrl,
    String? webhookUrl,
    Map<String, String>? metadata,
  }) async {
    final body = <String, dynamic>{
      'amount': amount,
      'currency': currency,
      'destination': destination.toJson(),
      if (description != null) 'description': description,
      if (reference != null) 'reference': reference,
      if (redirectUrl != null) 'redirect_url': redirectUrl,
      if (webhookUrl != null) 'webhook_url': webhookUrl,
      if (metadata != null) 'metadata': metadata,
    };
    final json = await _http.post('/payments/sessions', body);
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<PaymentSession> getSession(String sessionId) async {
    final json = await _http.get('/payments/sessions/$sessionId');
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<PaymentSession> cancelSession(String sessionId) async {
    final json = await _http.post('/payments/sessions/$sessionId/cancel');
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<List<PaymentSession>> listSessions({
    String? status,
    String? cursor,
    int? limit,
  }) async {
    final json = await _http.get('/payments/sessions', params: {
      'status': status,
      'cursor': cursor,
      'limit': limit?.toString(),
    });
    final list = (json as Map<String, dynamic>)['sessions'] as List;
    return list.map((e) => PaymentSession.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Mandate> createMandate({
    required String customerAlias,
    required int amount,
    required String currency,
    required String interval,
    required String description,
    required String startDate,
    String? endDate,
    int? maxAmount,
  }) async {
    final body = <String, dynamic>{
      'customer_alias': customerAlias,
      'amount': amount,
      'currency': currency,
      'interval': interval,
      'description': description,
      'start_date': startDate,
      if (endDate != null) 'end_date': endDate,
      if (maxAmount != null) 'max_amount': maxAmount,
    };
    final json = await _http.post('/recurring/mandates', body);
    return Mandate.fromJson(json as Map<String, dynamic>);
  }
}
