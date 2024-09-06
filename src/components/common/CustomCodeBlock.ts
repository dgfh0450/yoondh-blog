import Quill from 'quill';

const Block = Quill.import('blots/block');

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

CustomCodeBlock.blotName = 'custom-code-block';
CustomCodeBlock.tagName = 'pre';

export default CustomCodeBlock;
