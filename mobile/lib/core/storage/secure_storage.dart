import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'storage_keys.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: const IOSOptions(),
  );

  Future<void> saveToken(String token) =>
      _storage.write(key: StorageKeys.jwtToken, value: token);

  Future<String?> getToken() =>
      _storage.read(key: StorageKeys.jwtToken);

  Future<void> deleteToken() =>
      _storage.delete(key: StorageKeys.jwtToken);

  Future<bool> hasToken() async =>
      (await _storage.read(key: StorageKeys.jwtToken)) != null;

  Future<void> saveUsername(String username) =>
      _storage.write(key: StorageKeys.username, value: username);

  Future<String?> getUsername() =>
      _storage.read(key: StorageKeys.username);

  Future<void> clearAll() => _storage.deleteAll();
}
