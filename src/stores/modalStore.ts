import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  guidance: string;
  onSubmit: ((value: string) => void) | null;
  onCancel: (() => void) | null;
}

interface ModalStore extends ModalState {
  openModal: (
    title: string,
    placeholder: string,
    initialValue: string,
    onSubmit: (value: string) => void,
    onCancel: () => void,
    guidance?: string
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  title: '',
  placeholder: '',
  initialValue: '',
  guidance: '',
  onSubmit: null,
  onCancel: null,

  openModal: (title, placeholder, initialValue, onSubmit, onCancel, guidance = '') => {
    set({
      isOpen: true,
      title,
      placeholder,
      initialValue,
      guidance,
      onSubmit,
      onCancel,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      title: '',
      placeholder: '',
      initialValue: '',
      guidance: '',
      onSubmit: null,
      onCancel: null,
    });
  },
}));

// Global helper function that Phaser can call
export const showTextInput = (
  title: string,
  placeholder: string,
  initialValue: string = '',
  guidance: string = ''
): Promise<string | null> => {
  return new Promise((resolve) => {
    useModalStore.getState().openModal(
      title,
      placeholder,
      initialValue,
      (value) => {
        useModalStore.getState().closeModal();
        resolve(value);
      },
      () => {
        useModalStore.getState().closeModal();
        resolve(null);
      },
      guidance
    );
  });
};
