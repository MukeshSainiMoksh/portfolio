import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../providers/certification_provider.dart';
import '../../../core/router/route_names.dart';

class CertificationsListScreen extends ConsumerWidget {
  const CertificationsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final certAsync = ref.watch(certificationsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Certifications')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(RouteNames.certificationCreate),
        child: const Icon(Icons.add),
      ),
      body: certAsync.when(
        data: (items) => items.isEmpty
            ? const EmptyView(
              message: 'No certifications yet',
              icon: Icons.card_membership_outlined,
            )
            : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final cert = items[index];
                return GlassCard(
                  onTap: () => context.go(
                    '${RouteNames.certifications}/${cert.id}/edit',
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment:
                    CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                              CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cert.name,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium,
                                ),
                                Text(
                                  cert.issuer,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall,
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.delete,
                              color: AppColors.neonPink,
                            ),
                            onPressed: () {
                              ConfirmDialog.show(
                                context,
                                title: 'Delete Certification',
                                message: 'Delete this cert?',
                              ).then((confirmed) {
                                if (confirmed ?? false) {
                                  ref
                                      .read(certificationsProvider
                                      .notifier)
                                      .delete(cert.id);
                                }
                              });
                            },
                          ),
                        ],
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
          message: 'Failed to load certifications',
          onRetry: () => ref.refresh(certificationsProvider),
        ),
      ),
    );
  }
}
