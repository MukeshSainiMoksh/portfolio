import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/profile_provider.dart';

class ProfileFieldFormScreen extends ConsumerStatefulWidget {
  final int? profileId;

  const ProfileFieldFormScreen({super.key, this.profileId});

  bool get isEditing => profileId != null;

  @override
  ConsumerState<ProfileFieldFormScreen> createState() => _ProfileFieldFormScreenState();
}

class _ProfileFieldFormScreenState extends ConsumerState<ProfileFieldFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fieldNameCtrl = TextEditingController();
  final _fieldValueCtrl = TextEditingController();
  String _section = 'hero';
  String _fieldType = 'text';
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  static const List<String> _sectionOptions = ['hero', 'about', 'contact'];
  static const List<String> _fieldTypeOptions = ['text', 'url', 'email', 'phone', 'textarea'];

  @override
  void dispose() {
    _fieldNameCtrl.dispose();
    _fieldValueCtrl.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final profileAsync = ref.read(profileProvider);
    profileAsync.whenData((items) {
      final item = items.where((p) => p.id == widget.profileId).firstOrNull;
      if (item != null) {
        _fieldNameCtrl.text = item.fieldName;
        _fieldValueCtrl.text = item.fieldValue ?? '';
        setState(() {
          _section = item.section;
          _fieldType = item.fieldType;
          _isActive = item.isActive;
          _initialized = true;
        });
      }
    });
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final data = {
      'section': _section,
      'field_name': _fieldNameCtrl.text.trim(),
      'field_value': _fieldValueCtrl.text.trim(),
      'field_type': _fieldType,
      'is_active': _isActive,
    };
    try {
      if (widget.isEditing) {
        await ref.read(profileProvider.notifier).editItem(widget.profileId!, data);
      } else {
        await ref.read(profileProvider.notifier).create(data);
      }
      if (mounted) context.go('/profile');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.neonPink),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    _initFromExisting();
    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(widget.isEditing ? 'Edit Profile Field' : 'New Profile Field'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/profile'),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    children: [
                      DropdownButtonFormField<String>(
                        value: _section,
                        decoration: const InputDecoration(labelText: 'Section'),
                        items: _sectionOptions.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                        onChanged: (v) => setState(() => _section = v ?? 'hero'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _fieldNameCtrl,
                        decoration: const InputDecoration(labelText: 'Field Name *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _fieldValueCtrl,
                        decoration: const InputDecoration(labelText: 'Field Value'),
                        maxLines: _fieldType == 'textarea' ? 5 : 1,
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _fieldType,
                        decoration: const InputDecoration(labelText: 'Field Type'),
                        items: _fieldTypeOptions.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                        onChanged: (v) => setState(() => _fieldType = v ?? 'text'),
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        title: const Text('Active'),
                        value: _isActive,
                        activeColor: AppColors.neonCyan,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setState(() => _isActive = v),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.neonCyan,
                      foregroundColor: AppColors.background,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(widget.isEditing ? 'Update Field' : 'Create Field'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
