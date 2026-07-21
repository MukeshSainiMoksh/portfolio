import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/skill_provider.dart';

class SkillFormScreen extends ConsumerStatefulWidget {
  final int? skillId;

  const SkillFormScreen({super.key, this.skillId});

  bool get isEditing => skillId != null;

  @override
  ConsumerState<SkillFormScreen> createState() => _SkillFormScreenState();
}

class _SkillFormScreenState extends ConsumerState<SkillFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _categoryCtrl = TextEditingController();
  final _skillNameCtrl = TextEditingController();
  final _iconClassCtrl = TextEditingController();
  final _displayOrderCtrl = TextEditingController(text: '0');
  double _skillLevel = 50;
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _categoryCtrl.dispose();
    _skillNameCtrl.dispose();
    _iconClassCtrl.dispose();
    _displayOrderCtrl.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final skillsAsync = ref.read(skillsProvider);
    skillsAsync.whenData((skills) {
      final skill = skills.where((s) => s.id == widget.skillId).firstOrNull;
      if (skill != null) {
        _categoryCtrl.text = skill.category;
        _skillNameCtrl.text = skill.skillName;
        _iconClassCtrl.text = skill.iconClass ?? '';
        _displayOrderCtrl.text = skill.displayOrder.toString();
        setState(() {
          _skillLevel = skill.skillLevel.toDouble();
          _isActive = skill.isActive;
          _initialized = true;
        });
      }
    });
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final data = {
      'category': _categoryCtrl.text.trim(),
      'skill_name': _skillNameCtrl.text.trim(),
      'skill_level': _skillLevel.round(),
      'icon_class': _iconClassCtrl.text.trim().isEmpty ? null : _iconClassCtrl.text.trim(),
      'display_order': int.tryParse(_displayOrderCtrl.text) ?? 0,
      'is_active': _isActive,
    };
    try {
      if (widget.isEditing) {
        await ref.read(skillsProvider.notifier).editItem(widget.skillId!, data);
      } else {
        await ref.read(skillsProvider.notifier).create(data);
      }
      if (mounted) context.go('/skills');
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
          title: Text(widget.isEditing ? 'Edit Skill' : 'New Skill'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/skills'),
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
                      TextFormField(
                        controller: _categoryCtrl,
                        decoration: const InputDecoration(labelText: 'Category *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _skillNameCtrl,
                        decoration: const InputDecoration(labelText: 'Skill Name *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _iconClassCtrl,
                        decoration: const InputDecoration(labelText: 'Icon Class (e.g. fa-python)'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _displayOrderCtrl,
                        decoration: const InputDecoration(labelText: 'Display Order'),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Skill Level: ${_skillLevel.round()}%',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.neonCyan,
                            ),
                          ),
                        ],
                      ),
                      Slider(
                        value: _skillLevel,
                        min: 1,
                        max: 100,
                        divisions: 99,
                        label: '${_skillLevel.round()}%',
                        activeColor: AppColors.neonCyan,
                        inactiveColor: AppColors.surfaceSecondary,
                        onChanged: (v) => setState(() => _skillLevel = v),
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
                    child: Text(widget.isEditing ? 'Update Skill' : 'Create Skill'),
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
