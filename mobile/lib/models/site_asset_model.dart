/// Plain models for site assets (resume / intro video) — simple enough
/// that freezed codegen isn't warranted.
class SiteAssetInfo {
  final bool exists;
  final String? url;
  final int? sizeBytes;
  final double? updatedAt; // unix seconds

  const SiteAssetInfo({
    required this.exists,
    this.url,
    this.sizeBytes,
    this.updatedAt,
  });

  factory SiteAssetInfo.fromJson(Map<String, dynamic> json) => SiteAssetInfo(
        exists: json['exists'] as bool,
        url: json['url'] as String?,
        sizeBytes: json['size_bytes'] as int?,
        updatedAt: (json['updated_at'] as num?)?.toDouble(),
      );

  DateTime? get updatedDate => updatedAt == null
      ? null
      : DateTime.fromMillisecondsSinceEpoch((updatedAt! * 1000).round());
}

class SiteAssetsStatus {
  final SiteAssetInfo resume;
  final SiteAssetInfo introVideo;

  const SiteAssetsStatus({required this.resume, required this.introVideo});

  factory SiteAssetsStatus.fromJson(Map<String, dynamic> json) =>
      SiteAssetsStatus(
        resume:
            SiteAssetInfo.fromJson(json['resume'] as Map<String, dynamic>),
        introVideo: SiteAssetInfo.fromJson(
            json['intro_video'] as Map<String, dynamic>),
      );
}
