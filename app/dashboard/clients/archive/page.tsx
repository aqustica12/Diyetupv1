'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  ChefHat,
  X,
  Check,
  User,
  Calendar
} from 'lucide-react';

interface ClientGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  clientIds: string[];
  createdAt: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export default function ClientGroupsPage() {
  const [groups, setGroups] = useState<ClientGroup[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState<string | null>(null);
  const [showAssignDietModal, setShowAssignDietModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const colors = [
    '#10B981', // green
    '#3B82F6', // blue  
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316'  // orange
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadData = () => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    // Load groups
    const savedGroups = JSON.parse(localStorage.getItem(`clientGroups_${currentUserId}`) || '[]');
    setGroups(savedGroups);

    // Load clients
    const savedClients = JSON.parse(localStorage.getItem(`clients_${currentUserId}`) || '[]');
    setClients(savedClients);
  };

  const createGroup = React.useCallback((groupData: { name: string; description: string; color: string }) => {
    if (!groupData.name.trim()) return;

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const group: ClientGroup = {
      id: Date.now().toString(),
      name: groupData.name,
      description: groupData.description,
      color: groupData.color,
      clientIds: [],
      createdAt: new Date().toISOString()
    };

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    localStorage.setItem(`clientGroups_${currentUserId}`, JSON.stringify(updatedGroups));
  }, [groups]);

  const deleteGroup = (groupId: string) => {
    if (!confirm('Bu grubu silmek istediğinizden emin misiniz?')) return;

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem(`clientGroups_${currentUserId}`, JSON.stringify(updatedGroups));
  };

  const addClientToGroup = (groupId: string, clientId: string) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const updatedGroups = groups.map(group => {
      if (group.id === groupId && !group.clientIds.includes(clientId)) {
        return { ...group, clientIds: [...group.clientIds, clientId] };
      }
      return group;
    });

    setGroups(updatedGroups);
    localStorage.setItem(`clientGroups_${currentUserId}`, JSON.stringify(updatedGroups));
  };

  const removeClientFromGroup = (groupId: string, clientId: string) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;

    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return { ...group, clientIds: group.clientIds.filter(id => id !== clientId) };
      }
      return group;
    });

    setGroups(updatedGroups);
    localStorage.setItem(`clientGroups_${currentUserId}`, JSON.stringify(updatedGroups));
  };

  const getGroupClients = (group: ClientGroup) => {
    return clients.filter(client => group.clientIds.includes(client.id));
  };

  const getAvailableClients = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return clients;
    return clients.filter(client => !group.clientIds.includes(client.id));
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Group Card Component - Optimized
  const GroupCard = React.memo(({ 
    group, 
    clients, 
    onDeleteGroup, 
    onRemoveClient, 
    onAddClient, 
    onAssignDiet 
  }: {
    group: ClientGroup;
    clients: Client[];
    onDeleteGroup: (id: string) => void;
    onRemoveClient: (groupId: string, clientId: string) => void;
    onAddClient: (groupId: string) => void;
    onAssignDiet: (groupId: string) => void;
  }) => {
    const groupClients = clients.filter(client => group.clientIds.includes(client.id));
    
    const handleDelete = React.useCallback(() => {
      onDeleteGroup(group.id);
    }, [group.id, onDeleteGroup]);

    const handleAddClient = React.useCallback(() => {
      onAddClient(group.id);
    }, [group.id, onAddClient]);

    const handleAssignDiet = React.useCallback(() => {
      onAssignDiet(group.id);
    }, [group.id, onAssignDiet]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>{groupClients.length} danışan</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(group.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            {/* Client Avatars */}
            {groupClients.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Danışanlar</p>
                <div className="flex -space-x-2">
                  {groupClients.slice(0, 4).map(client => (
                    <div
                      key={client.id}
                      className="relative group"
                      title={`${client.firstName} ${client.lastName}`}
                    >
                      {client.avatar ? (
                        <img
                          src={client.avatar}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => onRemoveClient(group.id, client.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {groupClients.length > 4 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500">
                        +{groupClients.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddClient}
                className="flex-1"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Danışan Ekle
              </Button>
              <Button
                size="sm"
                onClick={handleAssignDiet}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={groupClients.length === 0}
              >
                <ChefHat className="w-4 h-4 mr-1" />
                Diyet Planı
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  });

  // Create Group Modal - Fully Isolated
  const CreateGroupModal = React.memo(() => {
    if (!showCreateModal) return null;
    return <CreateGroupModalContent onClose={() => setShowCreateModal(false)} onSubmit={createGroup} colors={colors} />;
  });

  function CreateGroupModalContent({ 
    onClose, 
    onSubmit, 
    colors 
  }: { 
    onClose: () => void; 
    onSubmit: (data: { name: string; description: string; color: string }) => void;
    colors: string[];
  }) {
    const [localGroup, setLocalGroup] = React.useState({
      name: '',
      description: '',
      color: '#10B981'
    });

    const handleSubmit = React.useCallback(() => {
      if (!localGroup.name.trim()) return;
      onSubmit(localGroup);
      setLocalGroup({ name: '', description: '', color: '#10B981' });
      onClose();
    }, [localGroup, onSubmit, onClose]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Yeni Grup Oluştur</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Grup Adı *</Label>
              <Input
                value={localGroup.name}
                onChange={(e) => setLocalGroup(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Grup adını girin"
                className="mt-1"
                autoFocus
              />
            </div>

            <div>
              <Label>Açıklama</Label>
              <Textarea
                value={localGroup.description}
                onChange={(e) => setLocalGroup(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Grup açıklaması (opsiyonel)"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Renk</Label>
              <div className="flex gap-2 mt-1">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setLocalGroup(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      localGroup.color === color ? 'border-gray-900' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!localGroup.name.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Oluştur
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Add Client Modal - Optimized
  const AddClientModal = React.memo(() => {
    if (!showAddClientModal) return null;

    const availableClients = getAvailableClients(showAddClientModal);

    const handleClose = React.useCallback(() => {
      setShowAddClientModal(null);
    }, []);

    const handleAddClient = React.useCallback((clientId: string) => {
      if (showAddClientModal) {
        addClientToGroup(showAddClientModal, clientId);
      }
    }, [showAddClientModal]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Gruba Danışan Ekle</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {availableClients.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Eklenebilecek danışan bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableClients.map(client => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={`${client.firstName} ${client.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{client.firstName} {client.lastName}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddClient(client.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-green-600" />
              Danışan Grupları
            </h1>
            <p className="text-gray-600 mt-2">
              Danışanlarınızı gruplara ayırın ve toplu diyet planı atayın.
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Grup
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Grup ara..."
                value={searchTerm}
                onChange={React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value);
                }, [])}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {groups.length === 0 ? 'Henüz grup yok' : 'Grup bulunamadı'}
              </h3>
              <p className="text-gray-500 mb-6">
                {groups.length === 0 
                  ? 'İlk grubunuzu oluşturarak başlayın'
                  : 'Arama kriterlerinize uygun grup bulunamadı'
                }
              </p>
              {groups.length === 0 && (
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Grubu Oluştur
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
                clients={clients}
                onDeleteGroup={deleteGroup}
                onRemoveClient={removeClientFromGroup}
                onAddClient={setShowAddClientModal}
                onAssignDiet={setShowAssignDietModal}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <CreateGroupModal />
        <AddClientModal />
        <AssignDietModal />
      </div>
    </DashboardLayout>
  );

  // Assign Diet Plan Modal
  function AssignDietModal() {
    if (!showAssignDietModal) return null;

    const group = groups.find(g => g.id === showAssignDietModal);
    const groupClients = group ? getGroupClients(group) : [];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Gruba Diyet Planı Ata</h3>
            <button
              onClick={() => setShowAssignDietModal(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group?.color }}
                />
                <h4 className="font-medium text-blue-900">{group?.name}</h4>
              </div>
              <p className="text-sm text-blue-700">
                Bu diyet planı {groupClients.length} danışana atanacak
              </p>
            </div>

            <div>
              <Label>Diyet Planı Seç</Label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Plan seçin</option>
                <option value="weight-loss">Kilo Verme Planı</option>
                <option value="muscle-gain">Kas Kazanma Planı</option>
                <option value="maintenance">Kilo Koruma Planı</option>
                <option value="healthy">Sağlıklı Beslenme Planı</option>
              </select>
            </div>

            <div>
              <Label>Not (Opsiyonel)</Label>
              <Textarea
                placeholder="Bu plan hakkında grup üyelerine not..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Client List Preview */}
            <div>
              <Label>Etkilenecek Danışanlar</Label>
              <div className="mt-1 space-y-2 max-h-40 overflow-y-auto">
                {groupClients.map(client => (
                  <div key={client.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={`${client.firstName} ${client.lastName}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {client.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm">{client.firstName} {client.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAssignDietModal(null)}
            >
              İptal
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ChefHat className="w-4 h-4 mr-2" />
              Planı Ata
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
}