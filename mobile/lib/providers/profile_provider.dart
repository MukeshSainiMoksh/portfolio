import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/profile_content_model.dart';
import '../repositories/profile_repository.dart';
import 'auth_provider.dart';

final profileRepositoryProvider = Provider<ProfileRepository>(
  (ref) => ProfileRepository(ref.read(dioClientProvider)),
);

class ProfileNotifier extends AsyncNotifier<List<ProfileContentModel>> {
  @override
  Future<List<ProfileContentModel>> build() async {
    return ref.read(profileRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(profileRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(profileRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(profileRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(profileRepositoryProvider).delete(id);
    await refresh();
  }
}

final profileProvider =
    AsyncNotifierProvider<ProfileNotifier, List<ProfileContentModel>>(
  ProfileNotifier.new,
);
