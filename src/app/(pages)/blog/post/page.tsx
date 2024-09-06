"use client";

import React, { FormEvent, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { IPost } from '../blog';
import Form from '@/components/common/Form';
import styled from '@emotion/styled';
import NextImage from 'next/image';
import customFetch from '@/functions/api';
import { useRouter } from 'next/navigation';
import ForwardedQuill from '@/components/common/Quill';
import ReactQuill, { Quill } from 'react-quill';
import '../../../../components/common/code-block.scss';

const Wrapper = styled.div`
    height: calc(90vh - 260px);
    padding: 3vw;
    
`;

const PostForm = styled(Form)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Input = styled.input`

    height: 35px;
    width: 100%;
    border: 1px #ccc solid;
    margin-bottom: 15px;
    padding: 15px;
`;

const CustomQuill = styled(ForwardedQuill)`
    height: 40vh;
    margin-bottom: 67px;

    flex-grow: 1;
`;

const ThumbnailContainer = styled.div`  
    height: 150px;
    display: flex;
    flex-direction: row;
`;

const ThumbnailLabel = styled.label`
    width: 50%;
    height: 100%;
    border: 1px #ccc dashed;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ThumbnailPreview = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const UploadBtn = styled.button`
    margin-top: 15px;
    width: 10%;
    padding: 5px;
    background-color: transparent;
    border: 1px #ccc solid;
    font-weight: 500;
    align-self: flex-end;
    &: active {
        background-color: #0064FF;
        color: #FFF;
    }
`;

export default function Post() {
    const router = useRouter();
    const [post, setPost] = useState<IPost>({
        title: '',
        body: ''
    });
    const [thumbnail, setThumbnail] = useState<{ width: number, src: string | null, name: string }>({
        width: 150,
        src: null,
        name: '',
    });
    const quillRef = useRef<ReactQuill>(null);

    const handleImage = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            if (input.files) {
                const file = input.files[0];
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    const res = await customFetch('/image/blog', 'POST', formData);
                    const url = res.image;

                    if (quillRef.current) {
                        const editor = quillRef.current.getEditor();
                        const range = editor.getSelection();
                        if (range) {
                            editor.insertEmbed(range.index, 'image', url);
                            // 이미지 삽입 후 자동 줄 바꿈
                            editor.insertEmbed(range.index + 1, 'block', '<br>');

                            // editor.container
                            // @ts-ignore
                            const editorElem = editor.container;
                            const imgElem = editorElem.querySelector(`img[src="${url}"]`);

                            if (imgElem) {
                                imgElem.setAttribute('style', 'max-width: 50%; height: auto;');
                            }

                            editor.setSelection({
                                index: range.index + 2,
                                length: 0
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleCodeBlock = () => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            if (range) {
                editor.insertEmbed(range.index, 'custom-code-block', '테스트')
            }
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['code-block', 'image'],
            ],
            handlers: {
                image: handleImage,
                'code-block': handleCodeBlock
            },
        }
    }), []);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const filename = file.name;
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;
                    const newWidth = (150 / height) * width;
                    setThumbnail({
                        width: newWidth,
                        src: reader.result as string,
                        name: filename,
                    });
                    setPost({ ...post, thumbnail: file }); ``;

                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadPost = async () => {
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('body', post.body);
        if (post.thumbnail) formData.append('thumbnail', post.thumbnail);
        const result = await customFetch('/blog', 'POST', formData);
        router.push('/blog');
    };

    return (
        <Wrapper>
            <PostForm onSubmit={(e) => {
                e.preventDefault();
                uploadPost();
            }}>
                <Input
                    placeholder='제목'
                    onChange={(e) => { setPost({ ...post, title: e.target.value }); }} />
                <CustomQuill
                    forwardedRef={quillRef}
                    theme='snow'
                    value={post.body}
                    onChange={(e) => { setPost({ ...post, body: e }); }}
                    modules={modules}
                    placeholder='본문'
                />
                <ThumbnailContainer>
                    <ThumbnailPreview>
                        {
                            thumbnail.src ?
                                <NextImage
                                    alt='selected-thumbnail'
                                    src={thumbnail.src}
                                    width={thumbnail.width}
                                    height={150}
                                    objectFit='contain'
                                />

                                :
                                <NextImage src='/image-file.svg' alt='thumbnail-btn' width={100} height={100} />
                        }
                    </ThumbnailPreview>
                    <ThumbnailLabel htmlFor='post-thumbnail'>
                        {
                            post.thumbnail ? thumbnail.name : '썸네일 선택하기'
                        }
                    </ThumbnailLabel>
                    <input onChange={handleFileChange} style={{ display: 'none' }} type='file' accept='image/*' id='post-thumbnail' />
                </ThumbnailContainer>
                <UploadBtn type='submit'>업로드</UploadBtn>
            </PostForm>

        </Wrapper>
    );
}
