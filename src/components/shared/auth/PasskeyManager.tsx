"use client";

import React, { useState, useEffect } from "react";
import { 
  Key, 
  Smartphone, 
  Monitor, 
  Shield, 
  Trash2, 
  Edit3, 
  Plus, 
  Clock, 
  MapPin,
  Fingerprint,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Sync,
  ExternalLink
} from "lucide-react";
import { authUtils, IPasskey, IPasskeyListResponse } from "@/apis/auth.api";
import { useToast } from "@/components/shared/ui/ToastProvider";
import { buildAdvancedComponent, getEnhancedSemanticColor } from "@/utils/designSystem";
import PasskeyAuthButton from "./PasskeyAuthButton";

interface PasskeyManagerProps {
  className?: string;
  showAddButton?: boolean;
  compact?: boolean;
}

const PasskeyManager: React.FC<PasskeyManagerProps> = ({
  className = "",
  showAddButton = true,
  compact = false
}) => {
  const [passkeys, setPasskeys] = useState<IPasskey[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAddPasskey, setShowAddPasskey] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const showToast = useToast();

  // Load passkeys on mount
  useEffect(() => {
    loadPasskeys();
  }, []);

  const loadPasskeys = async () => {
    try {
      setLoading(true);
      const response: IPasskeyListResponse = await authUtils.getPasskeys();
      if (response.success) {
        setPasskeys(response.data.passkeys);
      } else {
        showToast.error("Failed to load passkeys: " + response.message);
      }
    } catch (error) {
      showToast.error("Error loading passkeys");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (passkeyId: string) => {
    if (!editName.trim()) {
      showToast.error("Passkey name cannot be empty");
      return;
    }

    try {
      setActionLoading(passkeyId);
      const response = await authUtils.renamePasskey(passkeyId, editName.trim());
      
      if (response.success) {
        setPasskeys(prev => prev.map(p => 
          p.id === passkeyId ? { ...p, name: editName.trim() } : p
        ));
        setEditingId(null);
        setEditName("");
        showToast.success("Passkey renamed successfully");
      } else {
        showToast.error("Failed to rename passkey: " + response.message);
      }
    } catch (error) {
      showToast.error("Error renaming passkey");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (passkeyId: string, passkeyName: string) => {
    if (!confirm(`Are you sure you want to delete "${passkeyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(passkeyId);
      const response = await authUtils.deletePasskey(passkeyId);
      
      if (response.success) {
        setPasskeys(prev => prev.filter(p => p.id !== passkeyId));
        showToast.success("Passkey deleted successfully");
      } else {
        showToast.error("Failed to delete passkey: " + response.message);
      }
    } catch (error) {
      showToast.error("Error deleting passkey");
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (passkey: IPasskey) => {
    setEditingId(passkey.id);
    setEditName(passkey.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const getDeviceIcon = (passkey: IPasskey) => {
    const deviceType = passkey.deviceType.toLowerCase();
    
    if (deviceType.includes('iphone') || deviceType.includes('android')) {
      return <Smartphone className="w-5 h-5" />;
    }
    if (deviceType.includes('mac') || deviceType.includes('windows') || deviceType.includes('linux')) {
      return <Monitor className="w-5 h-5" />;
    }
    if (passkey.transports.includes('usb') || passkey.transports.includes('nfc')) {
      return <Key className="w-5 h-5" />;
    }
    return <Shield className="w-5 h-5" />;
  };

  const getSecurityLevel = (passkey: IPasskey) => {
    if (passkey.transports.includes('internal') && passkey.backupEligible) {
      return { level: 'High', color: 'text-green-600 dark:text-green-400', icon: <Fingerprint className="w-4 h-4" /> };
    }
    if (passkey.transports.includes('internal')) {
      return { level: 'Medium', color: 'text-blue-600 dark:text-blue-400', icon: <Shield className="w-4 h-4" /> };
    }
    return { level: 'Basic', color: 'text-yellow-600 dark:text-yellow-400', icon: <Key className="w-4 h-4" /> };
  };

  const formatLastUsed = (lastUsed?: string) => {
    if (!lastUsed) return 'Never used';
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading passkeys...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Passkeys
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your passwordless authentication methods
          </p>
        </div>
        {showAddButton && (
          <button
            onClick={() => setShowAddPasskey(true)}
            className={buildAdvancedComponent.glassButton({ size: 'sm' })}
          >
            <Plus className="w-4 h-4" />
            <span>Add Passkey</span>
          </button>
        )}
      </div>

      {/* Add New Passkey */}
      {showAddPasskey && (
        <div className={buildAdvancedComponent.glassCard({ variant: 'primary' })}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Create New Passkey</h4>
            <button
              onClick={() => setShowAddPasskey(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <PasskeyAuthButton
            mode="register"
            variant="primary"
            onSuccess={() => {
              setShowAddPasskey(false);
              loadPasskeys();
            }}
            onError={(error) => {
              showToast.error("Failed to create passkey: " + error.message);
            }}
          />
        </div>
      )}

      {/* Passkeys List */}
      {passkeys.length === 0 ? (
        <div className={buildAdvancedComponent.glassCard({ variant: 'secondary' })}>
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No passkeys yet
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first passkey for secure, passwordless authentication
            </p>
            {showAddButton && (
              <button
                onClick={() => setShowAddPasskey(true)}
                className={buildAdvancedComponent.glassButton({ size: 'md' })}
              >
                <Plus className="w-4 h-4" />
                <span>Create Passkey</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {passkeys.map((passkey) => {
            const security = getSecurityLevel(passkey);
            const isExpanded = expandedId === passkey.id;
            const isEditing = editingId === passkey.id;
            const isLoading = actionLoading === passkey.id;

            return (
              <div
                key={passkey.id}
                className={buildAdvancedComponent.glassCard({ 
                  variant: 'secondary',
                  hover: true 
                })}
              >
                {/* Main Passkey Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Device Icon */}
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      {getDeviceIcon(passkey)}
                    </div>

                    {/* Passkey Details */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(passkey.id)}
                            disabled={isLoading}
                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {passkey.name}
                            </h4>
                            {passkey.sync.isSync && (
                              <div className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                <Sync className="w-3 h-3" />
                                <span>Synced</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              {security.icon}
                              <span className={security.color}>{security.level}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatLastUsed(passkey.lastUsed)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{passkey.usage.count} uses</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : passkey.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEditing(passkey)}
                          className="p-2 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(passkey.id, passkey.name)}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* Technical Details */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">Technical Details</h5>
                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                          <div>Device: {passkey.deviceType}</div>
                          <div>Transports: {passkey.transports.join(', ')}</div>
                          <div>Counter: {passkey.counter}</div>
                          <div>Created: {new Date(passkey.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Usage Info */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">Usage Information</h5>
                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                          <div>Uses: {passkey.usage.count}</div>
                          {passkey.usage.lastIpAddress && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>Last IP: {passkey.usage.lastIpAddress}</span>
                            </div>
                          )}
                          {passkey.usage.lastLocation && (
                            <div>Location: {passkey.usage.lastLocation}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Features */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {passkey.backedUp && (
                        <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Backed Up</span>
                        </div>
                      )}
                      {passkey.backupEligible && (
                        <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          <Sync className="w-3 h-3" />
                          <span>Sync Eligible</span>
                        </div>
                      )}
                      {passkey.attestationType === 'self' && (
                        <div className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Self-Attested</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Security Notice */}
      {passkeys.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                Security Best Practices
              </p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Keep multiple passkeys for backup access</li>
                <li>• Regularly review and remove unused passkeys</li>
                <li>• Use biometric authentication when available for highest security</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasskeyManager; 