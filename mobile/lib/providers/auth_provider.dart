import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/api_exception.dart';
import '../core/network/dio_client.dart';
import '../core/storage/secure_storage.dart';
import '../models/auth/user_model.dart';
import '../repositories/auth_repository.dart';

// Infrastructure providers
final secureStorageProvider = Provider<SecureStorageService>(
  (ref) => SecureStorageService(),
);

final dioClientProvider = Provider<DioClient>((ref) {
  final storage = ref.read(secureStorageProvider);
  return DioClient(storage);
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    ref.read(dioClientProvider),
    ref.read(secureStorageProvider),
  );
});

// Auth state
class AuthState {
  final bool isLoading;
  final UserModel? user;
  final String? error;

  const AuthState({
    this.isLoading = false,
    this.user,
    this.error,
  });

  bool get isAuthenticated => user != null;

  static const _unset = Object();

  // sentinel-based so callers can explicitly clear user/error back to null
  AuthState copyWith({
    bool? isLoading,
    Object? user = _unset,
    Object? error = _unset,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      user: identical(user, _unset) ? this.user : user as UserModel?,
      error: identical(error, _unset) ? this.error : error as String?,
    );
  }
}

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repo;
  final SecureStorageService _storage;

  AuthNotifier(this._repo, this._storage) : super(const AuthState()) {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    try {
      final hasToken = await _storage.hasToken();
      if (hasToken) {
        final user = await _repo.getCurrentUser();
        state = AuthState(user: user);
      }
    } catch (_) {
      await _storage.clearAll();
      state = const AuthState();
    }
  }

  Future<void> login(String username, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repo.login(username, password);
      final user = await _repo.getCurrentUser();
      state = AuthState(user: user);
    } on ApiException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
    } catch (_) {
      // last-resort guard so an unexpected error never crashes the login flow
      state = state.copyWith(
        isLoading: false,
        error: 'Login failed. Check your connection and try again.',
      );
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    ref.read(authRepositoryProvider),
    ref.read(secureStorageProvider),
  );
});
