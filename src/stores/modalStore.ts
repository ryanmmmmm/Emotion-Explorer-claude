import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  onSubmit: ((value: string) => void) | null;
  onCancel: (() => void) | null;
}

interface ModalStore extends ModalState {
  openModal: (
    title: string,
    placeholder: string,
    initialValue: string,
    onSubmit: (value: string) => void,
    onCancel: () => void
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  title: '',
  placeholder: '',
  initialValue: '',
  onSubmit: null,
  onCancel: null,

  openModal: (title, placeholder, initialValue, onSubmit, onCancel) => {
    set({
      isOpen: true,
      title,
      placeholder,
      initialValue,
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
      onSubmit: null,
      onCancel: null,
    });
  },
}));

// Global helper function that Phaser can call
export const showTextInput = (
  title: string,
  placeholder: string,
  initialValue: string = ''
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
      }
    );
  });
};
