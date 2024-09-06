import dynamic from 'next/dynamic';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ForwardedQuillComponent extends ReactQuillProps {
    forwardedRef: React.Ref<ReactQuill>;
}

const ForwardedQuill = dynamic(
    async () => {
        const { default: QuillComponent } = await import('react-quill');
        const CustomCodeBlock = await import('./CustomCodeBlock').then(module => module.default);
        QuillComponent.Quill.register(CustomCodeBlock);
        const Quill = ({ forwardedRef, ...props }: ForwardedQuillComponent) => (
            <QuillComponent ref={forwardedRef} {...props} />
        );
        return Quill;
    },
    { ssr: false },
);

export default ForwardedQuill;

// reference : https://velog.io/@pds0309/nextjs%EC%97%90%EC%84%9C-dynamic-import%EB%A1%9C-quill-editor-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0