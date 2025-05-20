
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, ShieldCheck, ShieldX, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import PermissionGuard from '@/components/PermissionGuard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const Users = () => {
  const { allUsers, updateUserPermissions, user: currentUser, createUser } = useAuth();
  const { t, language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<(typeof allUsers)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  
  const permissionGroups = {
    user: ['user:create', 'user:read', 'user:update', 'user:delete'],
    order: ['order:create', 'order:read', 'order:update', 'order:delete'],
    product: ['product:create', 'product:read', 'product:update', 'product:delete'],
    customer: ['customer:create', 'customer:read', 'customer:update', 'customer:delete'],
    report: ['report:read']
  };

  const isRtl = language === 'ar';
  
  const handleManagePermissions = (user: typeof selectedUser) => {
    if (user) {
      setSelectedUser(user);
      setSelectedPermissions(user.permissions);
      setIsDialogOpen(true);
    }
  };
  
  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions(current => {
      if (current.includes(permission)) {
        return current.filter(p => p !== permission);
      } else {
        return [...current, permission];
      }
    });
  };
  
  const handleGroupChange = (group: keyof typeof permissionGroups, checked: boolean) => {
    const groupPermissions = permissionGroups[group];
    
    setSelectedPermissions(current => {
      if (checked) {
        // Add all permissions from the group that aren't already in the array
        const newPermissions = groupPermissions.filter(p => !current.includes(p));
        return [...current, ...newPermissions];
      } else {
        // Remove all permissions from the group
        return current.filter(p => !groupPermissions.includes(p));
      }
    });
  };
  
  const isGroupSelected = (group: keyof typeof permissionGroups) => {
    const groupPermissions = permissionGroups[group];
    return groupPermissions.every(p => selectedPermissions.includes(p));
  };
  
  const isGroupIndeterminate = (group: keyof typeof permissionGroups) => {
    const groupPermissions = permissionGroups[group];
    const selectedGroupPermissions = groupPermissions.filter(p => selectedPermissions.includes(p));
    return selectedGroupPermissions.length > 0 && selectedGroupPermissions.length < groupPermissions.length;
  };
  
  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUserPermissions(selectedUser.id, selectedPermissions);
      setIsDialogOpen(false);
    }
  };
  
  // Create user form schema
  const createUserSchema = z.object({
    username: z.string().min(3, t('usernameTooShort')),
    password: z.string().min(6, t('passwordTooShort')),
    role: z.enum(['admin', 'operator'])
  });
  
  const createUserForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'operator'
    }
  });
  
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>([]);
  
  const handleCreateUser = (values: z.infer<typeof createUserSchema>) => {
    const success = createUser(
      values.username, 
      values.role, 
      newUserPermissions, 
      values.password
    );
    
    if (success) {
      setIsCreateUserDialogOpen(false);
      createUserForm.reset();
      setNewUserPermissions([]);
    }
  };
  
  const openCreateUserDialog = () => {
    setNewUserPermissions([]);
    setIsCreateUserDialogOpen(true);
  };
  
  return (
    <div className={isRtl ? 'rtl' : ''}>
      <PageHeader
        title={t('userManagement')}
        subtitle={t('manageUsersAndPermissions')}
      />
      
      <PermissionGuard permission="user:read">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('users')}</CardTitle>
            <PermissionGuard permission="user:create">
              <Button onClick={openCreateUserDialog}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t('addUser')}
              </Button>
            </PermissionGuard>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('username')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('permissions')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.permissions.length > 5 
                          ? `${user.permissions.length} ${t('permissions')}`
                          : user.permissions.map(p => p.split(':')[0]).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                        {user.role === 'admin' && (
                          <ShieldCheck className="w-4 h-4 ml-2 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <PermissionGuard permission="user:update">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleManagePermissions(user)}
                          disabled={(currentUser?.id === user.id && user.role === 'admin')}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {t('managePermissions')}
                        </Button>
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PermissionGuard>
      
      {/* Permission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {t('managePermissionsFor')} {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {Object.keys(permissionGroups).map(group => (
              <div key={group} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`group-${group}`}
                    checked={isGroupSelected(group as keyof typeof permissionGroups)}
                    onCheckedChange={(checked) => handleGroupChange(group as keyof typeof permissionGroups, checked === true)}
                  />
                  <label 
                    htmlFor={`group-${group}`}
                    className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t(group)}
                  </label>
                </div>
                
                <div className="grid grid-cols-2 ml-6 gap-3">
                  {permissionGroups[group as keyof typeof permissionGroups].map(permission => {
                    const [resource, action] = permission.split(':');
                    
                    return (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox 
                          id={permission}
                          checked={selectedPermissions.includes(permission)}
                          onCheckedChange={() => handlePermissionChange(permission)}
                        />
                        <label 
                          htmlFor={permission}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(action)} {t(resource)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSavePermissions}>
              {t('savePermissions')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('createNewUser')}</DialogTitle>
          </DialogHeader>
          
          <Form {...createUserForm}>
            <form onSubmit={createUserForm.handleSubmit(handleCreateUser)} className="space-y-6">
              <FormField
                control={createUserForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enterUsername')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('enterPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('role')}</FormLabel>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="radio" 
                          id="role-operator" 
                          value="operator"
                          checked={field.value === 'operator'}
                          onChange={() => field.onChange('operator')}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="role-operator">{t('operator')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="radio" 
                          id="role-admin" 
                          value="admin"
                          checked={field.value === 'admin'}
                          onChange={() => field.onChange('admin')}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="role-admin">{t('admin')}</Label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t('permissions')}</h3>
                <div className="space-y-6">
                  {Object.keys(permissionGroups).map(group => (
                    <div key={group} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`new-group-${group}`}
                          checked={permissionGroups[group as keyof typeof permissionGroups].every(p => 
                            newUserPermissions.includes(p)
                          )}
                          onCheckedChange={(checked) => {
                            const groupPermissions = permissionGroups[group as keyof typeof permissionGroups];
                            
                            if (checked) {
                              setNewUserPermissions(current => {
                                const permissions = [...current];
                                groupPermissions.forEach(p => {
                                  if (!permissions.includes(p)) {
                                    permissions.push(p);
                                  }
                                });
                                return permissions;
                              });
                            } else {
                              setNewUserPermissions(current => 
                                current.filter(p => !groupPermissions.includes(p))
                              );
                            }
                          }}
                        />
                        <label 
                          htmlFor={`new-group-${group}`}
                          className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(group)}
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 ml-6 gap-3">
                        {permissionGroups[group as keyof typeof permissionGroups].map(permission => {
                          const [resource, action] = permission.split(':');
                          
                          return (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`new-${permission}`}
                                checked={newUserPermissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewUserPermissions(current => [...current, permission]);
                                  } else {
                                    setNewUserPermissions(current => 
                                      current.filter(p => p !== permission)
                                    );
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`new-${permission}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t(action)} {t(resource)}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('createUser')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
