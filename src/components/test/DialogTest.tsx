import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useLanguage } from '../../services/LanguageService';

const DialogTest: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {t('common.open')} {t('common.view')}
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
            <DialogTitle>
              {t('common.view')} {t('common.settings')}
            </DialogTitle>
            <DialogDescription>
              {t('common.view')} {t('common.settings')} {t('common.confirm')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('common.confirm')} {t('common.settings')} {t('common.success')}
            </p>
            
            <div className={`flex justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={() => setOpen(false)}>
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogTest;