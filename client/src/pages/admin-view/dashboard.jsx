import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from '@/store/common-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AdminDashBoard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl('');
      }
    });
  }

  function handleImageDelete(getCurrentImageId) {
    dispatch(deleteFeatureImage(getCurrentImageId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        //isEditMode={currentEditedId !== null}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        disabled={imageLoadingState}
        className="mt-5 w-full"
      >
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImageitem) => (
              <div className="relative">
                <img
                  src={featureImageitem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <Button
                  onClick={() => handleImageDelete(featureImageitem._id)}
                  className="mt-2 mb-5"
                >
                  Delete
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashBoard;
