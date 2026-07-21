import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/skill_model.dart';
import '../repositories/skill_repository.dart';
import 'auth_provider.dart';

final skillRepositoryProvider = Provider<SkillRepository>(
  (ref) => SkillRepository(ref.read(dioClientProvider)),
);

class SkillsNotifier extends AsyncNotifier<List<SkillModel>> {
  @override
  Future<List<SkillModel>> build() async {
    return ref.read(skillRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(skillRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(skillRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(skillRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(skillRepositoryProvider).delete(id);
    await refresh();
  }
}

final skillsProvider =
    AsyncNotifierProvider<SkillsNotifier, List<SkillModel>>(
  SkillsNotifier.new,
);
