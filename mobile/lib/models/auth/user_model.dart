import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required int id,
    required String email,
    required String username,
    @JsonKey(name: 'full_name') required String fullName,
    @JsonKey(name: 'is_active') required bool isActive,
    @JsonKey(name: 'is_admin') required bool isAdmin,
    @JsonKey(name: 'is_superuser') required bool isSuperuser,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'last_login') DateTime? lastLogin,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
