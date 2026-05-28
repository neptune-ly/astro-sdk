import '../astro_http.dart';
import '../models/models.dart';

class PaymentsClient {
  final AstroHttpClient _http;
  const PaymentsClient(this._http);

  Future<PaymentSession> createSession({
    required int amount,
    required String currency,
    Destination? destination,
    String? payerAlias,
    String? payerIban,
    required String description,
    String? reference,
    required String merchantReference,
    String? redirectUrl,
    String? cancelUrl,
    String? webhookUrl,
    Map<String, String>? metadata,
  }) async {
    final body = <String, dynamic>{
      'amount': amount,
      'currency': currency,
      if (destination != null) 'destination': destination.toJson(),
      if (payerAlias != null) 'payer_alias': payerAlias,
      if (payerIban != null) 'payer_iban': payerIban,
      'description': description,
      if (reference != null) 'reference': reference,
      'merchant_reference': merchantReference,
      if (redirectUrl != null) 'redirect_url': redirectUrl,
      if (cancelUrl != null) 'cancel_url': cancelUrl,
      if (webhookUrl != null) 'webhook_url': webhookUrl,
      if (metadata != null) 'metadata': metadata,
    };
    final json = await _http.post('/payments/initiate', body);
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<PaymentSession> getSession(String sessionId) async {
    final json = await _http.get('/payments/$sessionId');
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<PaymentSession> cancelSession(String sessionId) async {
    final json = await _http.post('/payments/$sessionId/cancel');
    return PaymentSession.fromJson(json as Map<String, dynamic>);
  }

  Future<Refund> createRefund(
    String sessionId,
    CreateRefundRequest request, {
    String? idempotencyKey,
  }) async {
    final json = await _http.post(
      '/payments/$sessionId/refunds',
      request.toJson(),
      idempotencyKey == null ? null : {'Idempotency-Key': idempotencyKey},
    );
    return Refund.fromJson(json as Map<String, dynamic>);
  }

  Future<RefundListResponse> listRefunds(String sessionId) async {
    final json = await _http.get('/payments/$sessionId/refunds');
    return RefundListResponse.fromJson(json as Map<String, dynamic>);
  }

  Future<Refund> getRefund(String refundId) async {
    final json = await _http.get('/payments/refunds/$refundId');
    return Refund.fromJson(json as Map<String, dynamic>);
  }

  Future<List<PaymentSession>> listSessions({
    String? status,
    String? cursor,
    int? limit,
  }) async {
    final json = await _http.get('/payments', params: {
      'status': status,
      'cursor': cursor,
      'limit': limit?.toString(),
    });
    final list = (json as Map<String, dynamic>)['sessions'] as List;
    return list.map((e) => PaymentSession.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Mandate> createMandate({
    String? payerAlias,
    String? payerIban,
    required int amountLimit,
    required String currency,
    required String frequency,
    required String description,
    required String consentRedirectUrl,
    String? merchantReference,
    Map<String, String>? metadata,
  }) async {
    final body = <String, dynamic>{
      if (payerAlias != null) 'payer_alias': payerAlias,
      if (payerIban != null) 'payer_iban': payerIban,
      'amount_limit': amountLimit,
      'currency': currency,
      'frequency': frequency,
      'description': description,
      'consent_redirect_url': consentRedirectUrl,
      if (merchantReference != null) 'merchant_reference': merchantReference,
      if (metadata != null) 'metadata': metadata,
    };
    final json = await _http.post('/recurring/mandates', body);
    return Mandate.fromJson(json as Map<String, dynamic>);
  }

  Future<MandateListResponse> listMandates({String? status, int? page, int? limit}) async {
    final json = await _http.get('/recurring/mandates', params: {
      'status': status,
      'page': page?.toString(),
      'limit': limit?.toString(),
    });
    return MandateListResponse.fromJson(json as Map<String, dynamic>);
  }

  Future<Mandate> getMandate(String mandateId) async {
    final json = await _http.get('/recurring/mandates/$mandateId');
    return Mandate.fromJson(json as Map<String, dynamic>);
  }

  Future<Mandate> cancelMandate(String mandateId) async {
    final json = await _http.delete('/recurring/mandates/$mandateId');
    return Mandate.fromJson(json as Map<String, dynamic>);
  }

  Future<MandateCharge> chargeMandate(
    String mandateId, {
    required int amount,
    required String description,
    String? merchantReference,
    String? idempotencyKey,
  }) async {
    final json = await _http.post(
      '/recurring/mandates/$mandateId/charge',
      {
        'amount': amount,
        'description': description,
        if (merchantReference != null) 'merchant_reference': merchantReference,
      },
      idempotencyKey == null ? null : {'Idempotency-Key': idempotencyKey},
    );
    return MandateCharge.fromJson(json as Map<String, dynamic>);
  }

  Future<MandateChargeListResponse> listMandateCharges(String mandateId, {int? page, int? limit}) async {
    final json = await _http.get('/recurring/mandates/$mandateId/charges', params: {
      'page': page?.toString(),
      'limit': limit?.toString(),
    });
    return MandateChargeListResponse.fromJson(json as Map<String, dynamic>);
  }
}
