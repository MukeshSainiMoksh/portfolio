import 'package:freezed_annotation/freezed_annotation.dart';

part 'media_file_model.freezed.dart';
part 'media_file_model.g.dart';

@freezed
class MediaFileModel with _$MediaFileModel {
  const factory MediaFileModel({
    required int id,
    required String filename,
    @JsonKey(name: 'original_name') required String originalName,
    @JsonKey(name: 'file_url') required String fileUrl,
    @JsonKey(name: 'file_type') required String fileType,
    @JsonKey(name: 'mime_type') String? mimeType,
    @JsonKey(name: 'file_size') required int fileSize,
    @JsonKey(name: 'alt_text') String? altText,
    String? description,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _MediaFileModel;

  factory MediaFileModel.fromJson(Map<String, dynamic> json) =>
      _$MediaFileModelFromJson(json);
}
