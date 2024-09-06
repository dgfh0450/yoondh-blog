import dynamic from 'next/dynamic';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

interface ForwardedQuillComponent extends ReactQuillProps {
    forwardedRef: React.Ref<ReactQuill>;
}

// Quill 블록 타입 정의
const Block = Quill.import('blots/block');

// 커스텀 Blot 클래스 정의
class CustomCodeBlock extends Block {
    static create(value: any) {
        let node = super.create();
        node.setAttribute('class', 'custom-code');
        node.setAttribute('spellcheck', 'false');
        return node;
    }

    static formats(node: any) {
        return node.getAttribute('data-value');
    }

    static value(node: any) {
        return node.getAttribute('data-value');
    }

    format(name: any, value: any) {
        if (name === 'custom-code-block' && value) {
            this.domNode.setAttribute('data-value', value);
        } else {
            super.format(name, value);
        }
    }
}

// CustomCodeBlock 블록 타입 등록
CustomCodeBlock.blotName = 'custom-code-block';
CustomCodeBlock.tagName = 'pre';

const ForwardedQuill = dynamic(
    async () => {
        const { default: QuillComponent } = await import('react-quill');
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