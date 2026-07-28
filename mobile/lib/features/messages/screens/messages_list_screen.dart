import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/empty_view.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../models/contact_message_model.dart';
import '../../../providers/contact_provider.dart';

class MessagesListScreen extends ConsumerStatefulWidget {
  const MessagesListScreen({super.key});

  @override
  ConsumerState<MessagesListScreen> createState() => _MessagesListScreenState();
}

class _MessagesListScreenState extends ConsumerState<MessagesListScreen> {
  bool _unreadOnly = false;
  int? _expandedId;

  @override
  Widget build(BuildContext context) {
    final messagesAsync = ref.watch(messagesProvider);
    final unreadCount = ref.watch(unreadMessagesCountProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(unreadCount > 0 ? 'Messages ($unreadCount unread)' : 'Messages'),
        actions: [
          IconButton(
            tooltip: _unreadOnly ? 'Show all' : 'Show unread only',
            icon: Icon(
              _unreadOnly ? Icons.mark_email_unread : Icons.all_inbox,
              color: _unreadOnly ? AppColors.neonCyan : AppColors.textSecondary,
            ),
            onPressed: () => setState(() => _unreadOnly = !_unreadOnly),
          ),
          IconButton(
            tooltip: 'Refresh',
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(messagesProvider.notifier).refresh(),
          ),
        ],
      ),
      body: messagesAsync.when(
        data: (all) {
          final items =
              _unreadOnly ? all.where((m) => !m.isRead).toList() : all;
          if (items.isEmpty) {
            return EmptyView(
              message: _unreadOnly ? 'No unread messages 🎉' : 'No messages yet',
              icon: Icons.mail_outline,
            );
          }
          return RefreshIndicator(
            color: AppColors.neonCyan,
            onRefresh: () => ref.read(messagesProvider.notifier).refresh(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) => _MessageCard(
                message: items[index],
                expanded: _expandedId == items[index].id,
                onToggle: () => _handleToggle(items[index]),
              ),
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.neonCyan),
          ),
        ),
        error: (_, __) => ErrorView(
          message: 'Failed to load messages',
          onRetry: () => ref.refresh(messagesProvider),
        ),
      ),
    );
  }

  void _handleToggle(ContactMessageModel message) {
    final next = _expandedId == message.id ? null : message.id;
    setState(() => _expandedId = next);
    if (next != null && !message.isRead) {
      ref.read(messagesProvider.notifier).setRead(message.id, true);
    }
  }
}

class _MessageCard extends ConsumerWidget {
  final ContactMessageModel message;
  final bool expanded;
  final VoidCallback onToggle;

  const _MessageCard({
    required this.message,
    required this.expanded,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dateStr = DateFormat('dd MMM yyyy · HH:mm').format(message.createdAt.toLocal());

    return GlassCard(
      onTap: onToggle,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // header row
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: message.isRead
                      ? AppColors.statusInactive
                      : AppColors.neonCyan,
                  boxShadow: message.isRead
                      ? null
                      : [
                          const BoxShadow(
                            color: AppColors.borderGlow,
                            blurRadius: 8,
                          ),
                        ],
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      message.name,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: message.isRead
                                ? FontWeight.w500
                                : FontWeight.bold,
                          ),
                    ),
                    Text(
                      message.email,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              if (message.isReplied)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.neonGreen.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: AppColors.neonGreen.withOpacity(0.4),
                    ),
                  ),
                  child: const Text(
                    'Replied',
                    style: TextStyle(fontSize: 10, color: AppColors.neonGreen),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),

          // subject / preview
          Text(
            message.subject?.isNotEmpty == true
                ? message.subject!
                : message.message,
            maxLines: expanded ? null : 1,
            overflow: expanded ? null : TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 6),
          Text(
            dateStr,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: AppColors.textMuted),
          ),

          // expanded body + actions
          if (expanded) ...[
            const Divider(color: AppColors.borderSubtle, height: 24),
            Text(
              message.message,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(height: 1.6),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _ActionChip(
                  icon: Icons.copy,
                  label: 'Copy Email',
                  color: AppColors.neonCyan,
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: message.email));
                    Fluttertoast.showToast(msg: 'Email copied: ${message.email}');
                  },
                ),
                _ActionChip(
                  icon: message.isReplied ? Icons.undo : Icons.reply,
                  label: message.isReplied ? 'Not Replied' : 'Mark Replied',
                  color: AppColors.neonGreen,
                  onTap: () => ref
                      .read(messagesProvider.notifier)
                      .setReplied(message.id, !message.isReplied),
                ),
                _ActionChip(
                  icon: Icons.mark_email_unread,
                  label: 'Mark Unread',
                  color: AppColors.neonPurple,
                  onTap: () => ref
                      .read(messagesProvider.notifier)
                      .setRead(message.id, false),
                ),
                _ActionChip(
                  icon: Icons.delete_outline,
                  label: 'Delete',
                  color: AppColors.neonPink,
                  onTap: () {
                    ConfirmDialog.show(
                      context,
                      title: 'Delete Message',
                      message: 'Delete this message permanently?',
                    ).then((confirmed) {
                      if (confirmed ?? false) {
                        ref.read(messagesProvider.notifier).delete(message.id);
                      }
                    });
                  },
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _ActionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionChip({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.35)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 15, color: color),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(fontSize: 12, color: color)),
          ],
        ),
      ),
    );
  }
}
