import { Fragment, useState } from 'react';
import imagesStyle from './images-style';
import { DropzoneDialogBase } from 'react-mui-dropzone';
import Button from '@mui/material/Button';
import thumbnail from '../../../../../../../public/images/thumbnail.png';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import TextValidator from 'react-material-ui-form-validator/lib/TextValidator';
import ImageGallery from 'react-image-gallery';

const Images = (props) => {
  const {
    t,
    values,
    errorRequied,
    fileObjects,
    onImageAdd,
    onImageDelete,
    onThumbButtonClick,
    onDeleteButtonClick,
    rtlActive,
  } = props;
  const classes = imagesStyle();
  const [open, setOpen] = useState(false);

  const dialogTitle = () => (
    <>
      <span>{t('uploadFile')}</span>
      <IconButton
        style={{ right: '12px', top: '8px', position: 'absolute' }}
        onClick={() => setOpen(false)}>
        <Close />
      </IconButton>
    </>
  );
  const startIndex = fileObjects.findIndex((object) => {
    return object.thumbnail === values.hotelThumb;
  })

  return (
    <Fragment>
      <Button
        variant='contained'
        color='secondary'
        fullWidth
        sx={{ mb: 2 }}
        disabled={values.hotelImages.length >= 10}
        onClick={() => setOpen(true)}>
        {t('upload')}
      </Button>
      <TextValidator
        type='hidden'
        className={classes.root}
        variant='standard'
        validators={['required']}
        errorMessages={[t('thumbNamerequired')]}
        error={errorRequied.hotelThumb}
        helperText={errorRequied.hotelThumb ? t('thumbNamerequired') : ''}
      />
      <div className={classes.div}>
        <DropzoneDialogBase
          acceptedFiles={['image/png', 'image/jpeg', 'image/jpg']}
          dialogTitle={dialogTitle()}
          fileObjects={fileObjects}
          cancelButtonText={t('cancel')}
          submitButtonText={t('submit')}
          open={open}
          onAdd={(newFileObjs) => {
            onImageAdd(newFileObjs);
          }}
          onDelete={(deleteFileObj) => {
            onImageDelete(deleteFileObj);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onSave={() => {
            setOpen(false);
          }}
          filesLimit={10}
          dropzoneText={t('dropZone')}
          maxFileSize={5000000}
          showFileNames
          showPreviews
          showPreviewsInDropzone={false}
          showFileNamesInPreview
          useChipsForPreview
          showAlerts={['error']}
          getFileLimitExceedMessage={() => {
            return t('maximum');
          }}
          previewChipProps={{
            color: 'secondary',
          }}
        />
        <div className={classes.heroContent}>
          {fileObjects.length > 0 && (
            <ImageGallery
              items={fileObjects}
              isRTL={rtlActive}
              showPlayButton={false}
              startIndex={startIndex !== -1 ? startIndex : 0}
              thumbnailPosition='top'
              showBullets
              renderThumbInner={(item) => {
                const isThumbImage =
                  values.hotelThumb ==
                  (typeof values.hotelThumb == 'object'
                    ? item.file
                    : item.data);
                return (
                  <span className='image-gallery-thumbnail-inner'>
                    <img
                      className='image-gallery-thumbnail-image'
                      src={item.thumbnail}
                    />
                    {isThumbImage && (
                      <img
                        src={thumbnail.src}
                        alt=''
                        className={classes.thumbnailThumb}
                      />
                    )}
                  </span>
                );
              }}
              renderItem={(item) => {
                const index = fileObjects.findIndex((object) => {
                  return object.thumbnail === item.thumbnail;
                });
                const isThumbImage =
                  values.hotelThumb ==
                  (typeof values.hotelThumb == 'object'
                    ? item.file
                    : item.data);
                return (
                  <Fragment>
                    <div>
                      <img
                        className='image-gallery-image'
                        src={item.data}
                        style={{ position: 'relative' }}
                      />

                      {isThumbImage && (
                        <img
                          src={thumbnail.src}
                          alt=''
                          className={classes.thumbnail}
                        />
                      )}
                      <div className='center'>
                        <Button
                          className={classes.button}
                          onClick={() => {
                            onThumbButtonClick(item, isThumbImage);
                          }}>
                          {values.hotelThumb !== '' && isThumbImage
                            ? t('notThumb')
                            : t('makeThumbnail')}
                        </Button>
                        <Button
                          className={classes.button}
                          onClick={() => {
                            onDeleteButtonClick(index, isThumbImage);
                          }}>
                          {t('delete')}
                        </Button>
                      </div>
                    </div>
                  </Fragment>
                );
              }}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Images;
