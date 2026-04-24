import '../astro_http.dart';
import '../models/models.dart';

class OpenBankingClient {
  final AstroHttpClient _http;
  const OpenBankingClient(this._http);

  Future<Consent> createConsent({
    required String bankHandle,
    required List<String> scopes,
    required String redirectUri,
    required String state,
    required String codeChallenge,
    String codeChallengeMethod = 'S256',
    int? expiryDays,
  }) async {
    final body = <String, dynamic>{
      'bank_handle': bankHandle,
      'scopes': scopes,
      'redirect_uri': redirectUri,
      'state': state,
      'code_challenge': codeChallenge,
      'code_challenge_method': codeChallengeMethod,
      if (expiryDays != null) 'expiry_days': expiryDays,
    };
    final json = await _http.post('/ob/consents', body);
    return Consent.fromJson(json as Map<String, dynamic>);
  }

  Future<Consent> getConsent(String consentId) async {
    final json = await _http.get('/ob/consents/$consentId');
    return Consent.fromJson(json as Map<String, dynamic>);
  }

  Future<void> revokeConsent(String consentId) async {
    await _http.delete('/ob/consents/$consentId');
  }

  Future<TokenResponse> exchangeCode({
    required String code,
    required String redirectUri,
    required String consentId,
    required String codeVerifier,
  }) async {
    final json = await _http.post('/ob/token', {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri,
      'consent_id': consentId,
      'code_verifier': codeVerifier,
    });
    return TokenResponse.fromJson(json as Map<String, dynamic>);
  }

  Future<TokenResponse> refreshToken(String refreshToken) async {
    final json = await _http.post('/ob/token', {
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
    });
    return TokenResponse.fromJson(json as Map<String, dynamic>);
  }

  Future<List<OBAccount>> getAccounts(String accessToken, String consentId) async {
    final json = await _http.get(
      '/ob/accounts',
      extraHeaders: {
        'Authorization': 'Bearer $accessToken',
        'X-Consent-Id': consentId,
      },
    );
    final list = (json as Map<String, dynamic>)['accounts'] as List;
    return list.map((e) => OBAccount.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<OBTransaction>> getTransactions(
    String accessToken,
    String consentId,
    String accountId, {
    String? fromDate,
    String? toDate,
  }) async {
    final json = await _http.get(
      '/ob/accounts/$accountId/transactions',
      params: {'from_date': fromDate, 'to_date': toDate},
      extraHeaders: {
        'Authorization': 'Bearer $accessToken',
        'X-Consent-Id': consentId,
      },
    );
    final list = (json as Map<String, dynamic>)['transactions'] as List;
    return list.map((e) => OBTransaction.fromJson(e as Map<String, dynamic>)).toList();
  }
}
