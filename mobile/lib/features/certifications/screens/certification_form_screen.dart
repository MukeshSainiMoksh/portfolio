import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/certification_provider.dart';

class CertificationFormScreen extends ConsumerStatefulWidget {
  final int? certificationId;

  const CertificationFormScreen({super.key, this.certificationId});

  bool get isEditing => certificationId != null;

  @override
  ConsumerState<CertificationFormScreen> createState() => _CertificationFormScreenState();
}

class _CertificationFormScreenState extends ConsumerState<CertificationFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _issuerCtrl = TextEditingController();
  final _credentialIdCtrl = TextEditingController();
  final _credentialUrlCtrl = TextEditingController();
  final _issueDateCtrl = TextEditingController();
  final _expiryDateCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _badgeUrlCtrl = TextEditingController();
  final _displayOrderCtrl = TextEditingController(text: '0');
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _issuerCtrl.dispose();
    _credentialIdCtrl.dispose();
    _credentialUrlCtrl.dispose();
    _issueDateCtrl.dispose();
    _expiryDateCtrl.dispose();
    _descCtrl.dispose();
    _badgeUrlCtrl.dispose();
    _displayOrderCtrl.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final certAsync = ref.read(certificationsProvider);
    certAsync.whenData((items) {
      final item = items.where((c) => c.id == widget.certificationId).firstOrNull;
      if (item != null) {
        _nameCtrl.text = item.name;
        _issuerCtrl.text = item.issuer;
        _credentialIdCtrl.text = item.credentialId ?? '';
        _credentialUrlCtrl.text = item.credentialUrl ?? '';
        _issueDateCtrl.text = item.issueDate ?? '';
        _expiryDateCtrl.text = item.expiryDate ?? '';
        _descCtrl.text = item.description ?? '';
        _badgeUrlCtrl.text = item.badgeUrl ?? '';
        _displayOrderCtrl.text = item.displayOrder.toString();
        setState(() {
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
      'name': _nameCtrl.text.trim(),
      'issuer': _issuerCtrl.text.trim(),
      if (_credentialIdCtrl.text.isNotEmpty) 'credential_id': _credentialIdCtrl.text.trim(),
      if (_credentialUrlCtrl.text.isNotEmpty) 'credential_url': _credentialUrlCtrl.text.trim(),
      if (_issueDateCtrl.text.isNotEmpty) 'issue_date': _issueDateCtrl.text.trim(),
      if (_expiryDateCtrl.text.isNotEmpty) 'expiry_date': _expiryDateCtrl.text.trim(),
      if (_descCtrl.text.isNotEmpty) 'description': _descCtrl.text.trim(),
      if (_badgeUrlCtrl.text.isNotEmpty) 'badge_url': _badgeUrlCtrl.text.trim(),
      'display_order': int.tryParse(_displayOrderCtrl.text) ?? 0,
      'is_active': _isActive,
    };
    try {
      if (widget.isEditing) {
        await ref.read(certificationsProvider.notifier).editItem(widget.certificationId!, data);
      } else {
        await ref.read(certificationsProvider.notifier).create(data);
      }
      if (mounted) context.go('/certifications');
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
          title: Text(widget.isEditing ? 'Edit Certification' : 'New Certification'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/certifications'),
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
                        controller: _nameCtrl,
                        decoration: const InputDecoration(labelText: 'Certification Name *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _issuerCtrl,
                        decoration: const InputDecoration(labelText: 'Issuer *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _credentialIdCtrl,
                        decoration: const InputDecoration(labelText: 'Credential ID'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _credentialUrlCtrl,
                        decoration: const InputDecoration(labelText: 'Credential URL'),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _issueDateCtrl,
                              decoration: const InputDecoration(labelText: 'Issue Date (YYYY-MM-DD)'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _expiryDateCtrl,
                              decoration: const InputDecoration(labelText: 'Expiry Date (YYYY-MM-DD)'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _descCtrl,
                        decoration: const InputDecoration(labelText: 'Description'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _badgeUrlCtrl,
                        decoration: const InputDecoration(labelText: 'Badge URL'),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _displayOrderCtrl,
                        decoration: const InputDecoration(labelText: 'Display Order'),
                        keyboardType: TextInputType.number,
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
                    child: Text(widget.isEditing ? 'Update Certification' : 'Create Certification'),
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
