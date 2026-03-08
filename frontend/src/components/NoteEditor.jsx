import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoteEditor = ({ value, onChange, readOnly = false }) => {
    const modules = useMemo(
        () => ({
            toolbar: readOnly
                ? false
                : {
                    container: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        ['clean'],
                    ],
                },
        }),
        [readOnly]
    );

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'list',
        'bullet',
        'blockquote',
        'code-block',
        'link',
        'image',
    ];

    return (
        <div className="note-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                readOnly={readOnly}
                placeholder="Start writing your note..."
            />
        </div>
    );
};

export default NoteEditor;
