import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [alertUpload, setAlertUpload] = useState('');
  const [timer, setTimer] = useState(10);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    if (uploadedFiles) {
      uploadedFiles.forEach(file => {
        data.append('file', file.file);
      });
    }
    try {
      await api.post('/transactions/import', data);
      setAlertUpload('Importado com Sucesso');
      setTimeout(() => {
        history.push('/');
      }, 10000);
    } catch (err) {
      console.log(err.response.error);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  function submitFile(files: File[]): void {
    const fProps: FileProps[] = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: file.size.toString(),
      };
    });
    console.log(files);
    console.log(fProps);
    setUploadedFiles(fProps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
          {alertUpload && (
            <p>
              {alertUpload}
              <br />
              Você será redirecionado em: {timer}
            </p>
          )}
        </ImportFileContainer>
        {/* <FileList files={uploadedFiles} /> */}
      </Container>
    </>
  );
};

export default Import;
