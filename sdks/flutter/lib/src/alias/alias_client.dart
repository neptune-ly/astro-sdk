import '../astro_http.dart';
import '../models/models.dart';

class AliasClient {
  final AstroHttpClient _http;
  const AliasClient(this._http);

  Future<AliasProfile> getProfile(String alias) async {
    final json = await _http.get('/alias/$alias');
    return AliasProfile.fromJson(json as Map<String, dynamic>);
  }

  Future<List<LinkedAccount>> getAccounts(String alias) async {
    final json = await _http.get('/alias/$alias/accounts');
    final list = (json as Map<String, dynamic>)['accounts'] as List;
    return list.map((e) => LinkedAccount.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<AliasProfile> deactivate(String alias) async {
    final json = await _http.post('/alias/$alias/deactivate');
    return AliasProfile.fromJson(json as Map<String, dynamic>);
  }

  Future<ResolveResult> resolve(String alias) async {
    final json = await _http.get('/alias/$alias/resolve');
    return ResolveResult.fromJson(json as Map<String, dynamic>);
  }
}
