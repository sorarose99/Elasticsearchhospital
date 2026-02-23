import React, { useState, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit2, 
  Plus, 
  Trash2, 
  Settings,
  RefreshCw,
  Save
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useMenuCustomization, CustomMenuItem } from '../../services/MenuCustomizationService';

interface MenuCustomizerProps {
  language: 'en' | 'ar';
  userRole: string;
}

export const MenuCustomizer: React.FC<MenuCustomizerProps> = ({
  language,
  userRole
}) => {
  const {
    customMenuItems,
    updateMenuItem,
    reorderMenuItems,
    hideMenuItem,
    showMenuItem,
    addCustomMenuItem,
    removeCustomMenuItem,
    resetToDefault,
    getVisibleMenuItems
  } = useMenuCustomization();

  const [editingItem, setEditingItem] = useState<CustomMenuItem | null>(null);
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [newItemData, setNewItemData] = useState({
    moduleId: '',
    label: '',
    labelAr: '',
    icon: '',
    color: ''
  });

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(customMenuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderMenuItems(items);
  }, [customMenuItems, reorderMenuItems]);

  const handleSaveEdit = useCallback(() => {
    if (editingItem) {
      updateMenuItem(editingItem.id, editingItem);
      setEditingItem(null);
    }
  }, [editingItem, updateMenuItem]);

  const handleAddCustomItem = useCallback(() => {
    if (newItemData.moduleId && newItemData.label) {
      addCustomMenuItem({
        moduleId: newItemData.moduleId,
        label: newItemData.label,
        labelAr: newItemData.labelAr || newItemData.label,
        icon: newItemData.icon || 'Settings',
        color: newItemData.color,
        visible: true,
        isCustom: true
      });

      setNewItemData({
        moduleId: '',
        label: '',
        labelAr: '',
        icon: '',
        color: ''
      });
      setNewItemDialog(false);
    }
  }, [newItemData, addCustomMenuItem]);

  const MenuItemCard = ({ item, index }: { item: CustomMenuItem; index: number }) => (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
        >
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div
                  {...provided.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: item.color || 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm">
                      {language === 'ar' ? item.labelAr : item.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.moduleId}{item.viewId ? `/${item.viewId}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.isCustom && (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'ar' ? 'مخصص' : 'Custom'}
                      </Badge>
                    )}
                    
                    <Switch
                      checked={item.visible}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          showMenuItem(item.id);
                        } else {
                          hideMenuItem(item.id);
                        }
                      }}
                      size="sm"
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem({ ...item })}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>

                    {item.isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomMenuItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Child items */}
              {item.children && item.children.length > 0 && (
                <div className="ml-8 mt-3 space-y-2">
                  {item.children.map((child) => (
                    <div key={child.id} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                      <div className="w-4 h-4 rounded bg-muted flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      </div>
                      <span className="text-sm flex-1">
                        {language === 'ar' ? child.labelAr : child.label}
                      </span>
                      <Switch
                        checked={child.visible}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            showMenuItem(child.id);
                          } else {
                            hideMenuItem(child.id);
                          }
                        }}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {language === 'ar' ? 'تخصيص القوائم' : 'Menu Customization'}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewItemDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة عنصر' : 'Add Item'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'ar'
              ? 'اسحب وأفلت لإعادة ترتيب عناصر القائمة، أو استخدم المفاتيح لإظهار/إخفاء العناصر'
              : 'Drag and drop to reorder menu items, or use toggles to show/hide items'
            }
          </p>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {customMenuItems.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm mb-2">
              {language === 'ar' ? 'معاينة القائمة' : 'Menu Preview'}
            </h4>
            <div className="space-y-1">
              {getVisibleMenuItems().map((item) => (
                <div key={item.id} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color || 'var(--primary)' }}
                  />
                  <span>{language === 'ar' ? item.labelAr : item.label}</span>
                  {item.children && item.children.some(child => child.visible) && (
                    <Badge variant="outline" className="text-xs">
                      {item.children.filter(child => child.visible).length}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'تحرير عنصر القائمة' : 'Edit Menu Item'}
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                <Input
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    label: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
                <Input
                  value={editingItem.labelAr || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    labelAr: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label>{language === 'ar' ? 'اللون' : 'Color'}</Label>
                <Input
                  type="color"
                  value={editingItem.color || '#030213'}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    color: e.target.value
                  })}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={newItemDialog} onOpenChange={setNewItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إضافة عنصر مخصص' : 'Add Custom Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>{language === 'ar' ? 'معرف الوحدة' : 'Module ID'}</Label>
              <Input
                value={newItemData.moduleId}
                onChange={(e) => setNewItemData({
                  ...newItemData,
                  moduleId: e.target.value
                })}
                placeholder="custom-module"
              />
            </div>
            
            <div>
              <Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
              <Input
                value={newItemData.label}
                onChange={(e) => setNewItemData({
                  ...newItemData,
                  label: e.target.value
                })}
                placeholder="Custom Menu Item"
              />
            </div>
            
            <div>
              <Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
              <Input
                value={newItemData.labelAr}
                onChange={(e) => setNewItemData({
                  ...newItemData,
                  labelAr: e.target.value
                })}
                placeholder="عنصر قائمة مخصص"
              />
            </div>
            
            <div>
              <Label>{language === 'ar' ? 'اللون' : 'Color'}</Label>
              <Input
                type="color"
                value={newItemData.color || '#030213'}
                onChange={(e) => setNewItemData({
                  ...newItemData,
                  color: e.target.value
                })}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewItemDialog(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleAddCustomItem}>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};