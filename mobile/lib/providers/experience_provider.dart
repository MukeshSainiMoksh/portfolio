import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/experience_model.dart';
import '../repositories/experience_repository.dart';
import 'auth_provider.dart';

final experienceRepositoryProvider = Provider<ExperienceRepository>(
  (ref) => ExperienceRepository(ref.read(dioClientProvider)),
);

class ExperienceNotifier extends AsyncNotifier<List<ExperienceModel>> {
  @override
  Future<List<ExperienceModel>> build() async {
    return ref.read(experienceRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(experienceRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(experienceRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(experienceRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(experienceRepositoryProvider).delete(id);
    await refresh();
  }
}

final experienceProvider =
    AsyncNotifierProvider<ExperienceNotifier, List<ExperienceModel>>(
  ExperienceNotifier.new,
);
