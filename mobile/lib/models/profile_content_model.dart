import 'package:freezed_annotation/freezed_annotation.dart';

part 'profile_content_model.freezed.dart';
part 'profile_content_model.g.dart';

@freezed
class ProfileContentModel with _$ProfileContentModel {
  const factory ProfileContentModel({
    required int id,
    required String section,
    @JsonKey(name: 'field_name') required String fieldName,
    @JsonKey(name: 'field_value') String? fieldValue,
    @JsonKey(name: 'field_type') required String fieldType,
    @JsonKey(name: 'is_active') required bool isActive,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _ProfileContentModel;

  factory ProfileContentModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileContentModelFromJson(json);
}
