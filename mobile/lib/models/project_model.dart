import 'package:freezed_annotation/freezed_annotation.dart';

part 'project_model.freezed.dart';
part 'project_model.g.dart';

@freezed
class ProjectModel with _$ProjectModel {
  const factory ProjectModel({
    required int id,
    required String title,
    String? tagline,
    String? description,
    String? role,
    String? duration,
    List<String>? technologies,
    List<String>? features,
    @JsonKey(name: 'live_url') String? liveUrl,
    @JsonKey(name: 'github_url') String? githubUrl,
    @JsonKey(name: 'image_url') String? imageUrl,
    @JsonKey(name: 'icon_class') String? iconClass,
    @JsonKey(name: 'project_tag') String? projectTag,
    @JsonKey(name: 'is_featured') required bool isFeatured,
    @JsonKey(name: 'display_order') required int displayOrder,
    @JsonKey(name: 'is_active') required bool isActive,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _ProjectModel;

  factory ProjectModel.fromJson(Map<String, dynamic> json) =>
      _$ProjectModelFromJson(json);
}
