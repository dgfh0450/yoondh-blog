"use client";

import React, { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IPost } from '../blog';
import Form from '@/components/ common/Form';
import styled from '@emotion/styled';
import NextImage from 'next/image';

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

const CustomQuill = styled(ReactQuill)`
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
    const [post, setPost] = useState<IPost>({
        title: '',
        body: ''
    });
    const [thumbnail, setThumbnail] = useState<{width: number, src: string | null, name: string}>({
        width: 150,
        src: null,
        name: '',
    });

    const handleImage = async () => {
        console.log('image');
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
                image: handleImage
            }
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
                    // Calculate the new width maintaining the aspect ratio
                    const newWidth = (150 / height) * width;
                    setThumbnail({
                        width: newWidth,
                        src: reader.result as string,
                        name: filename,
                    });
                    setPost({...post, thumbnail: file});``;

                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    

    return (
        <Wrapper>
            <PostForm>
                <Input
                    placeholder='제목'
                    onChange={(e) => { setPost({ ...post, title: e.target.value }); }} />
                <CustomQuill
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
                                <NextImage src='/image-file.svg' alt='thumbnail-btn' width={100} height={100}/>
                        }
                    </ThumbnailPreview>
                    <ThumbnailLabel htmlFor='post-thumbnail'>
                        {
                            post.thumbnail ? thumbnail.name : '썸네일 선택하기'
                        }
                    </ThumbnailLabel>
                    <input onChange={handleFileChange} style={{ display: 'none' }} type='file' accept='image/*' id='post-thumbnail' />
                </ThumbnailContainer>
                <UploadBtn>업로드</UploadBtn>
            </PostForm>

        </Wrapper>
    );
}
