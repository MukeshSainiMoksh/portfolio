import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/certification_model.dart';
import '../repositories/certification_repository.dart';
import 'auth_provider.dart';

final certificationRepositoryProvider = Provider<CertificationRepository>(
  (ref) => CertificationRepository(ref.read(dioClientProvider)),
);

class CertificationNotifier extends AsyncNotifier<List<CertificationModel>> {
  @override
  Future<List<CertificationModel>> build() async {
    return ref.read(certificationRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(certificationRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(certificationRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(certificationRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(certificationRepositoryProvider).delete(id);
    await refresh();
  }
}

final certificationsProvider =
    AsyncNotifierProvider<CertificationNotifier, List<CertificationModel>>(
  CertificationNotifier.new,
);
