import { useState, useEffect } from "react";
import { notification } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export const useProductManagement = (pageSize: number, searchValue: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [api, contextHolder] = notification.useNotification();
    const [addModal, setAddModal] = useState(false);
    const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

    // Form & Image state
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        categoryId: "",
    });

    const getImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return "/blank.jpg";
        return imageUrl.startsWith("http")
            ? imageUrl
            : `https://localhost:7041${imageUrl}`;
    };

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProductsAdmin(page, pageSize);
            if (response.isSuccess) {
                setProducts(response.list);
                setTotal(response.totalElement ?? 0);
            }
        } catch (error) {
            api.error({
                title: "Error",
                description: "Failed to load products",
                duration: 2,
            });
        }
    };

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await categoryService.getCategories();
            if (response.isSuccess) {
                setCategories(response.list || []);
            }
        } catch (error) {
            api.error({
                title: "Error",
                description: "Failed to load categories",
                duration: 2,
            });
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleSearchproduct = async () => {
        try {
            if (searchValue === "") return;
            const response = await productService.searchProduct(searchValue, page, pageSize);
            if (response.isSuccess) {
                setSearchedProducts(response.list);
                setTotal(response.totalElement ?? 0);
            }
        } catch (error) {
            api.error({
                title: "Error",
                description: "Failed to load products",
                duration: 2,
            });
        }
    }
    const handleUpdateClick = async (product: Product) => {
        // await fetchCategories();

        const currentCategory = categories.find(
            (cat) =>
                cat.categoryName.trim().toLowerCase() ===
                product.categoryName.trim().toLowerCase()
        );

        setSelectedProduct(product);
        setFormData({
            productName: product.productName,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            categoryId: currentCategory?.id || "",
        });
        setPreviewImage(getImageUrl(product.imageUrl));
        setFileList([]);
        setImageFile(null);
        setUpdateModal(true);
    };

    const handleAddClick = () => {
        setFormData({
            productName: "",
            description: "",
            price: 0,
            stock: 0,
            imageUrl: "",
            categoryId: "",
        })
        setPreviewImage("");
        setFileList([]);
        setImageFile(null);
        setAddModal(true);
    }

    const handleImageChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const file = newFileList[0].originFileObj as File;
            setImageFile(file);

            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            if (selectedProduct) {
                setPreviewImage(getImageUrl(selectedProduct.imageUrl));
            }
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isImage) {
            api.error({ title: "You can only upload image files!", duration: 2 });
            return false;
        }
        if (!isLt5M) {
            api.error({ title: "Image must be smaller than 5MB!", duration: 2 });
            return false;
        }
        return false; // Prevent auto upload
    };

    const handleConfirmUpdate = async () => {
        if (!selectedProduct) return;

        if (!formData.productName || !formData.price || !formData.categoryId) {
            api.warning({
                title: "Please fill in all required fields",
                duration: 2,
            });
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("ProductName", formData.productName);
            formDataToSend.append("Description", formData.description || "");
            formDataToSend.append("Price", formData.price.toString());
            formDataToSend.append("Stock", formData.stock.toString());
            formDataToSend.append("CategoryId", formData.categoryId);

            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }

            const res = await productService.updateProduct(
                selectedProduct.id,
                formDataToSend
            );

            if (!res.isSuccess) throw new Error(res.message);

            api.success({
                title: res.message || "Product updated successfully",
                duration: 2,
            });

            setUpdateModal(false);
            resetModal();
            await fetchProducts();
        } catch (error: any) {
            api.error({
                title: error.message || "Failed to update product",
                duration: 3,
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            const res = await productService.deleteProduct(selectedProduct.id);
            if (!res.isSuccess) throw new Error(res.message);

            api.success({ title: "Product deleted successfully", duration: 2 });
            setProducts(products.filter((p) => p.id !== selectedProduct.id));
            setTotal(total - 1);
            setDeleteModal(false);
            setSelectedProduct(null);
        } catch (error: any) {
            api.error({
                title: error.message || "Failed to delete product",
                duration: 3,
            });
        }
    };

    const handleImageRemove = () => {
        setFileList([]);
        setImageFile(null);
        if (selectedProduct) {
            setPreviewImage(getImageUrl(selectedProduct.imageUrl));
        } else {
            setPreviewImage("");
        }
    };

    const resetModal = () => {
        setSelectedProduct(null);
        setImageFile(null);
        setFileList([]);
        setPreviewImage("");
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        handleSearchproduct();
    }, [searchValue])

    return {
        products,
        searchedProducts,
        categories,
        categoriesLoading,
        total,
        page,
        setPage,
        deleteModal,
        setDeleteModal,
        addModal,
        setAddModal,
        updateModal,
        setUpdateModal,
        selectedProduct,
        setSelectedProduct,
        contextHolder,
        fileList,
        imageFile,
        previewImage,
        formData,
        setFormData,
        getImageUrl,
        handleUpdateClick,
        handleAddClick,
        handleImageChange,
        handleImageRemove,
        beforeUpload,
        handleConfirmUpdate,
        handleConfirmDelete,
        resetModal,
    };
};