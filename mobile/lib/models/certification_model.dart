import 'package:freezed_annotation/freezed_annotation.dart';

part 'certification_model.freezed.dart';
part 'certification_model.g.dart';

@freezed
class CertificationModel with _$CertificationModel {
  const factory CertificationModel({
    required int id,
    required String name,
    required String issuer,
    @JsonKey(name: 'credential_id') String? credentialId,
    @JsonKey(name: 'credential_url') String? credentialUrl,
    @JsonKey(name: 'issue_date') String? issueDate,
    @JsonKey(name: 'expiry_date') String? expiryDate,
    String? description,
    @JsonKey(name: 'badge_url') String? badgeUrl,
    @JsonKey(name: 'display_order') required int displayOrder,
    @JsonKey(name: 'is_active') required bool isActive,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _CertificationModel;

  factory CertificationModel.fromJson(Map<String, dynamic> json) =>
      _$CertificationModelFromJson(json);
}
