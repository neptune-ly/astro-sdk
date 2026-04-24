import 'astro_http.dart';
import 'payments/payments_client.dart';
import 'alias/alias_client.dart';
import 'openbanking/openbanking_client.dart';
import 'identity/identity_client.dart';
import 'webhooks/webhook_verifier.dart';

export 'models/models.dart';
export 'payments/payments_client.dart';
export 'alias/alias_client.dart';
export 'openbanking/openbanking_client.dart';
export 'identity/identity_client.dart';
export 'webhooks/webhook_verifier.dart';

class AstroConfig {
  final String baseUrl;
  final String? merchantKey;
  final String? bankKey;
  final String? adminKey;
  final Duration timeout;

  const AstroConfig({
    required this.baseUrl,
    this.merchantKey,
    this.bankKey,
    this.adminKey,
    this.timeout = const Duration(seconds: 30),
  });
}

class AstroClient {
  late final PaymentsClient payments;
  late final AliasClient alias;
  late final OpenBankingClient openBanking;
  late final IdentityClient identity;

  AstroClient(AstroConfig config) {
    final http = AstroHttpClient(
      baseUrl: config.baseUrl,
      merchantKey: config.merchantKey,
      bankKey: config.bankKey,
      adminKey: config.adminKey,
      timeout: config.timeout,
    );
    payments = PaymentsClient(http);
    alias = AliasClient(http);
    openBanking = OpenBankingClient(http);
    identity = IdentityClient(http);
  }

  WebhookVerifier webhookVerifier(String secret) => WebhookVerifier(secret);
}
