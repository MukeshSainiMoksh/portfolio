import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import '../../../core/config/endpoints.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/error_view.dart';
import '../../../models/site_asset_model.dart';
import '../../../providers/asset_provider.dart';

class SiteAssetsScreen extends ConsumerWidget {
  const SiteAssetsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assetsAsync = ref.watch(siteAssetsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Resume & Intro Video'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(siteAssetsProvider.notifier).refresh(),
          ),
        ],
      ),
      body: assetsAsync.when(
        data: (status) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Latest versions upload karo — website automatically inhe use '
              'karegi (Download CV button + intro video section).',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            _AssetCard(
              title: 'Resume (CV)',
              icon: Icons.description,
              accent: AppColors.neonCyan,
              hint: 'PDF only · max 10 MB',
              info: status.resume,
              endpoint: Endpoints.assetsResume,
              allowedExtensions: const ['pdf'],
            ),
            const SizedBox(height: 16),
            _AssetCard(
              title: 'Intro Video',
              icon: Icons.videocam,
              accent: AppColors.neonPurple,
              hint: 'MP4 / WebM / MOV · max 100 MB',
              info: status.introVideo,
              endpoint: Endpoints.assetsIntroVideo,
              allowedExtensions: const ['mp4', 'webm', 'mov'],
            ),
          ],
        ),
        loading: () => const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.neonCyan),
          ),
        ),
        error: (_, __) => ErrorView(
          message: 'Failed to load asset status',
          onRetry: () => ref.refresh(siteAssetsProvider),
        ),
      ),
    );
  }
}

class _AssetCard extends ConsumerStatefulWidget {
  final String title;
  final IconData icon;
  final Color accent;
  final String hint;
  final SiteAssetInfo info;
  final String endpoint;
  final List<String> allowedExtensions;

  const _AssetCard({
    required this.title,
    required this.icon,
    required this.accent,
    required this.hint,
    required this.info,
    required this.endpoint,
    required this.allowedExtensions,
  });

  @override
  ConsumerState<_AssetCard> createState() => _AssetCardState();
}

class _AssetCardState extends ConsumerState<_AssetCard> {
  double? _progress; // null = idle, 0..1 = uploading

  String _formatSize(int? bytes) {
    if (bytes == null) return '—';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(0)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  Future<void> _pickAndUpload() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: widget.allowedExtensions,
      withData: true, // web needs bytes
    );
    if (result == null || result.files.isEmpty) return;
    final file = result.files.first;

    setState(() => _progress = 0);
    try {
      await ref.read(assetRepositoryProvider).upload(
            widget.endpoint,
            file,
            onProgress: (sent, total) {
              if (total > 0 && mounted) {
                setState(() => _progress = sent / total);
              }
            },
          );
      await ref.read(siteAssetsProvider.notifier).refresh();
      Fluttertoast.showToast(msg: '${widget.title} updated — website par live!');
    } catch (e) {
      final msg = e is ApiException
          ? e.message
          : 'Upload failed. Check connection and try again.';
      Fluttertoast.showToast(msg: msg);
    } finally {
      if (mounted) setState(() => _progress = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final info = widget.info;
    final uploading = _progress != null;

    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: widget.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                  border:
                      Border.all(color: widget.accent.withOpacity(0.3)),
                ),
                child: Icon(widget.icon, color: widget.accent),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.title,
                        style: Theme.of(context).textTheme.titleMedium),
                    Text(
                      widget.hint,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // status row
          if (info.exists) ...[
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.neonGreen,
                    boxShadow: [
                      BoxShadow(color: AppColors.neonGreen, blurRadius: 6),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'Live on website',
                  style:
                      TextStyle(fontSize: 12, color: AppColors.neonGreen),
                ),
                const SizedBox(width: 16),
                Text(
                  _formatSize(info.sizeBytes),
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
            if (info.updatedDate != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  'Updated ${DateFormat('dd MMM yyyy · HH:mm').format(info.updatedDate!.toLocal())}',
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textMuted),
                ),
              ),
          ] else
            const Text(
              'Not uploaded yet — website apna bundled file use kar rahi hai.',
              style: TextStyle(fontSize: 12, color: AppColors.textMuted),
            ),
          const SizedBox(height: 16),

          // upload button / progress
          if (uploading) ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: _progress,
                minHeight: 6,
                backgroundColor: widget.accent.withOpacity(0.1),
                valueColor: AlwaysStoppedAnimation<Color>(widget.accent),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Uploading ${((_progress ?? 0) * 100).toStringAsFixed(0)}%',
              style: TextStyle(fontSize: 12, color: widget.accent),
            ),
          ] else
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: widget.accent.withOpacity(0.15),
                  foregroundColor: widget.accent,
                  side: BorderSide(color: widget.accent.withOpacity(0.4)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                icon: const Icon(Icons.upload_file, size: 18),
                label: Text(info.exists ? 'Replace with Latest' : 'Upload'),
                onPressed: _pickAndUpload,
              ),
            ),
        ],
      ),
    );
  }
}
