import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/education_model.dart';
import '../repositories/education_repository.dart';
import 'auth_provider.dart';

final educationRepositoryProvider = Provider<EducationRepository>(
  (ref) => EducationRepository(ref.read(dioClientProvider)),
);

class EducationNotifier extends AsyncNotifier<List<EducationModel>> {
  @override
  Future<List<EducationModel>> build() async {
    return ref.read(educationRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(educationRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(educationRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(educationRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(educationRepositoryProvider).delete(id);
    await refresh();
  }
}

final educationProvider =
    AsyncNotifierProvider<EducationNotifier, List<EducationModel>>(
  EducationNotifier.new,
);
