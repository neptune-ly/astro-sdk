import '../astro_http.dart';
import '../models/models.dart';

class IdentityClient {
  final AstroHttpClient _http;
  const IdentityClient(this._http);

  Future<ResolveResult> resolve(String alias) async {
    final json = await _http.get('/v1/registry/resolve/$alias');
    return ResolveResult.fromJson(json as Map<String, dynamic>);
  }

  Future<List<BankEntry>> listBanks() async {
    final json = await _http.get('/v1/banks');
    final list = (json as List);
    return list.map((e) => BankEntry.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<BankEntry> getBank(String bankHandle) async {
    final json = await _http.get('/v1/banks/$bankHandle');
    return BankEntry.fromJson(json as Map<String, dynamic>);
  }
}
