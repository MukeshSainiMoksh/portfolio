import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/media_provider.dart';
import '../../../core/config/app_config.dart';

class MediaGalleryScreen extends ConsumerWidget {
  const MediaGalleryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaAsync = ref.watch(mediaProvider);
    final imagePicker = ImagePicker();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Media Gallery')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final image = await imagePicker.pickImage(
            source: ImageSource.gallery,
          );
          if (image != null) {
            ref
                .read(mediaProvider.notifier)
                .upload(File(image.path));
          }
        },
        child: const Icon(Icons.add_photo_alternate),
      ),
      body: mediaAsync.when(
        data: (files) => files.isEmpty
            ? const EmptyView(
              message: 'No media files yet',
              icon: Icons.image_not_supported_outlined,
            )
            : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate:
              const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: files.length,
              itemBuilder: (context, index) {
                final file = files[index];
                final fileUrl =
                '${AppConfig.baseUrl}${file.fileUrl}';

                return GlassCard(
                  padding: EdgeInsets.zero,
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => Dialog(
                        backgroundColor: Colors.transparent,
                        child: GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: CachedNetworkImage(
                            imageUrl: fileUrl,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    );
                  },
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      CachedNetworkImage(
                        imageUrl: fileUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          color: AppColors.surfaceSecondary,
                          child: const Center(
                            child: CircularProgressIndicator(
                              valueColor:
                              AlwaysStoppedAnimation<Color>(
                                AppColors.neonCyan,
                              ),
                            ),
                          ),
                        ),
                        errorWidget: (context, url, error) =>
                        Container(
                          color: AppColors.surfaceSecondary,
                          child: const Icon(
                            Icons.broken_image,
                            color: AppColors.neonPink,
                          ),
                        ),
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: IconButton(
                          icon: const Icon(
                            Icons.delete,
                            color: AppColors.neonPink,
                          ),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.black45,
                          ),
                          onPressed: () {
                            ConfirmDialog.show(
                              context,
                              title: 'Delete File',
                              message:
                              'Delete "${file.originalName}"?',
                            ).then((confirmed) {
                              if (confirmed ?? false) {
                                ref
                                    .read(mediaProvider.notifier)
                                    .delete(file.id);
                              }
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        loading: () => const Center(
          child: CircularProgressIndicator(
            valueColor:
            AlwaysStoppedAnimation<Color>(AppColors.neonCyan),
          ),
        ),
        error: (_, __) => ErrorView(
          message: 'Failed to load media',
          onRetry: () => ref.refresh(mediaProvider),
        ),
      ),
    );
  }
}
