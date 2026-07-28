import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/site_asset_model.dart';
import '../repositories/asset_repository.dart';
import 'auth_provider.dart';

final assetRepositoryProvider = Provider<AssetRepository>(
  (ref) => AssetRepository(ref.read(dioClientProvider)),
);

class SiteAssetsNotifier extends AsyncNotifier<SiteAssetsStatus> {
  @override
  Future<SiteAssetsStatus> build() async {
    return ref.read(assetRepositoryProvider).getStatus();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(assetRepositoryProvider).getStatus(),
    );
  }
}

final siteAssetsProvider =
    AsyncNotifierProvider<SiteAssetsNotifier, SiteAssetsStatus>(
  SiteAssetsNotifier.new,
);
