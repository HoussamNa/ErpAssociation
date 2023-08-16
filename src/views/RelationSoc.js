  import React, { useState, useEffect } from "react";
  import {
    Card,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
  } from "reactstrap";
  import Header from "components/Headers/Header2.js";
  import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from 'reactstrap';
 

  const RelationSoc = () => {

    const [modalAdd, setModalAdd] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [sortBy, setSortBy] = useState(null); // 'asc', 'desc', or null
    const [sortColumn, setSortColumn] = useState('updateDate'); // Default to sorting by updateDate
    const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const successMessage = 'تم حفظ البيانات بنجاح';
    const [selectedRow, setSelectedRow] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);


    const toggleSelectedRow = (rowData) => {
      if (selectedRow === rowData) {
        setSelectedRow(null); // Deselect the row if it's already selected
      } else {
        setSelectedRow(rowData); // Select the row if it's not selected
      }
    };

    const selectedRowStyle = {
      backgroundColor: 'turquoise',
    };
    
    
    

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide the notification after 3 seconds
  };

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleSort = (column, order) => {
      setSortColumn(column);
      setSortBy(order);
      toggleDropdown(); // Close the dropdown after selecting an option
    };
    
    const [data, setData] = useState([]);

    useEffect(() => {
      fetchData();
    }, []);
    
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-data");
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData); // Assuming the response data is an array of objects
        } else {
          console.error("Error fetching data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    


    const toggleAdd = () => setModalAdd(!modalAdd);

    const [formData, setFormData] = useState({
      region: '',
      situation: '',
      responsible: '',
      widowName: '',
      widowBirthDate: '',
      nationalId: '',
      widowOccupation: '',
      widowHealthStatus: '',
      governmentSupport: '',
      deathDate: '',
      orphanLastName: '',
      orphanFirstName: '',
      educationLevel2023_2022: '',
      employer: '',
      section: '',
      course1Score: '',
      exam1Score: '',
      course2Score: '',
      overallScore: '',
      transferStatus: '',
      educationLevel2023_2024: '',
      address: '',
      phone: '',
      notes: '',
      committeeNotes: '',
      decisionDate: '',
      updateDate: '',
      support: '',
    });


    const handleFormSubmit = async () => {

      console.log(formData);

      try {
        const response = await fetch('http://localhost:3001/save-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchData();
          showNotification(successMessage, 'success'); // Show success notification
          setTimeout(() => {
            toggleAdd(); // Close the form after a short delay
          }, 1000); // Adjust the delay as needed (in milliseconds)
        } else {
          console.error('Error saving data');
          showNotification('حدث خطأ أثناء حفظ البيانات', 'danger'); // Show error notification
        }
      } catch (error) {
        console.error('Error saving data:', error);
        showNotification('حدث خطأ أثناء حفظ البيانات', 'danger'); // Show error notification
      }
    };

    const handleUpdate = async () => {
      try {
        console.log("Updating data for ID:", selectedRow.id);
        const response = await fetch(`http://localhost:3001/update-data/${selectedRow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        });
    
        console.log("Response status:", response.status);
    
        if (response.ok) {
          showNotification('تم تحديث البيانات بنجاح', 'success'); // Show success notification
          // Refresh the data after successful update
          fetchData();
        } else {
          console.error('Error updating data');
          showNotification('حدث خطأ أثناء تحديث البيانات', 'danger'); // Show error notification
        }
      } catch (error) {
        console.error('Error updating data:', error);
        showNotification('حدث خطأ أثناء تحديث البيانات', 'danger'); // Show error notification
      }
    };

    const handleDelete = async () => {
      if (!selectedRow) {
        console.error('No row selected for deletion');
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:3001/delete-data/${selectedRow.id}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          showNotification('تم حذف البيانات بنجاح', 'success'); // Show success notification
          // Refresh the data after successful delete
          fetchData();
          setSelectedRow(null); // Clear the selected row after deletion
        } else {
          console.error('Error deleting data');
          showNotification('حدث خطأ أثناء حذف البيانات', 'danger'); // Show error notification
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        showNotification('حدث خطأ أثناء حذف البيانات', 'danger'); // Show error notification
      }
    };
    

    const [excelFile, setExcelFile] = useState(null);

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setExcelFile(selectedFile);
    };
    
    const importExcelData = async () => {
      if (!excelFile) {
        console.error('No file selected');
        return;
      }
    
      const formData = new FormData();
      formData.append('excelFile', excelFile);
    
      try {
        const response = await fetch('http://localhost:3001/import-excel', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          console.log('Excel data imported and saved successfully');
          fetchData(); // Refresh data after import
        } else {
          console.error('Error importing Excel data');
        }
      } catch (error) {
        console.error('Error importing Excel data:', error);
      }
    };
          
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
              <CardHeader className="bg-transparent border-0">
              <div className="col text-right">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret color="info">
                  ترتيب حسب
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => handleSort('updateDate', 'asc')}>
                    تاريخ التحيين (تصاعدي)
                  </DropdownItem>
                  <DropdownItem onClick={() => handleSort('updateDate', 'desc')}>
                    تاريخ التحيين (تنازلي)
                  </DropdownItem>
                  {/* Add more sorting options for other columns */}
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="col text-right">
              <Input
                type="text"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
                    <h3 className="mb-0">جدول العائلات</h3>
                      <div className="col text-right">
                      <Button color="danger" onClick={handleDelete}>
                        حذف
                      </Button>
                        <Button color="info" className="mr-2" onClick={() => {
                        if (selectedRow) {
                          setIsEditMode(true);
                          setEditFormData(selectedRow);
                          toggleAdd();
                        } else {
                          // Show a message indicating that a row should be selected first
                        }
                      }}>
                        تعديل
                      </Button>
                        <Button color="success" className="mr-2" onClick={toggleAdd}>
                          إضافة
                        </Button>
                        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                        <Button onClick={importExcelData}>Import Excel Data</Button>
                      </div>

                      
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">المساعدات</th>
                      <th scope="col">تاريخ التحيين</th>
                      <th scope="col">تاريخ القرار</th>
                      <th scope="col">ملاحظات/قرار اللجنة</th>
                      <th scope="col">ملاحظات</th>
                      <th scope="col">الهاتف</th>
                      <th scope="col">العنوان</th>
                      <th scope="col">النوع/المستوى الدراسي 2023/2024</th>
                      <th scope="col">ينتقل نعم/لا</th>
                      <th scope="col">المعدل العام</th>
                      <th scope="col">معدل الدورة 2</th>
                      <th scope="col">معدل الامتحان الدورة 1</th>
                      <th scope="col">معدل الدورة 1</th>
                      <th scope="col">الشعبة</th>
                      <th scope="col">المشغل/المؤسسة</th>
                      <th scope="col">النوع/المستوى الدراسي 2023/2022</th>
                      <th scope="col">الاسم الشخصي لليتيم</th>
                      <th scope="col">الاسم العائلي لليتيم</th>
                      <th scope="col">تاريخ وفاة الهالك</th>
                      <th scope="col">الدعم الحكومي/التغطية الاجتماعية</th>
                      <th scope="col">الوضعية الصحية للأرملة</th>
                      <th scope="col">مهنة الأرملة</th>
                      <th scope="col">رقم البطاقة الوطنية للأرملة</th>
                      <th scope="col">تاريخ ازدياد الأرملة</th>
                      <th scope="col">اسم الأرملة</th>
                      <th scope="col">مسؤول المنطقة</th>
                      <th scope="col">الوضعية</th>
                      <th scope="col">المنطقة</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .sort((a, b) => {
                        if (sortBy === 'asc') {
                          return a[sortColumn].localeCompare(b[sortColumn]);
                        } else if (sortBy === 'desc') {
                          return b[sortColumn].localeCompare(a[sortColumn]);
                        }
                        return 0;
                      })
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .filter(item => {
                        // Apply search filter here based on the searchQuery and relevant item fields
                        const searchFields = ['region', 'situation', 'responsible', 'widowName', 'widowBirthDate', 'nationalId', 'widowOccupation', 'widowHealthStatus', 'governmentSupport', 'deathDate', 'orphanLastName', 'orphanFirstName', 'educationLevel2023_2022', 'employer', 'section', 'course1Score', 'overallScore', 'transferStatus', 'educationLevel2023_2024', 'address', 'phone', 'committeeNotes', 'decisionDate', 'updateDate', 'support'];
                      
                        const searchQueryLower = searchQuery ? searchQuery.toLowerCase() : '';
                      
                        // Check if any of the search fields contain the search query
                        const matchesSearch = searchFields.some(field => {
                          const fieldValue = item[field] || ''; // Default to empty string if field is null
                          const fieldValueLower = fieldValue.toLowerCase();
                          return fieldValueLower.includes(searchQueryLower);
                        });
                      
                        return matchesSearch;
                      })
                      
                      .map((item, index) => (
                        <tr
                        key={index}
                        onClick={() => toggleSelectedRow(item)} // Toggle selected row
                        style={selectedRow === item ? selectedRowStyle : {}}
                      >
                      <td>{item.support}</td>
                      <td>{item.updateDate}</td>
                      <td>{item.decisionDate}</td>
                      <td>{item.committeeNotes}</td>
                      <td>{item.notes}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.educationLevel2023_2024}</td>
                      <td>{item.transferStatus}</td>
                      <td>{item.overallScore}</td>
                      <td>{item.course2Score}</td>
                      <td>{item.exam1Score}</td>
                      <td>{item.course1Score}</td>
                      <td>{item.section}</td>
                      <td>{item.employer}</td>
                      <td>{item.educationLevel2023_2022}</td>
                      <td>{item.orphanFirstName}</td>
                      <td>{item.orphanLastName}</td>
                      <td>{item.deathDate}</td>
                      <td>{item.governmentSupport}</td>
                      <td>{item.widowHealthStatus}</td>
                      <td>{item.widowOccupation}</td>
                      <td>{item.nationalId}</td>
                      <td>{item.widowBirthDate}</td>
                      <td>{item.widowName}</td>
                      <td>{item.responsible}</td>
                      <td>{item.situation}</td>
                      <td>{item.region}</td>
                      <td> {/* Empty cell for action buttons */}</td>
                    </tr>
                  ))}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
        <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
            <PaginationLink
            href="#pablo"
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage - 1);
            }}
            tabIndex="-1"
            >
            <i className="fas fa-angle-left" />
            <span className="sr-only">Previous</span>
            </PaginationLink>
        </PaginationItem>
        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map(
            (_, index) => (
            (index + 1 === currentPage || Math.abs(index + 1 - currentPage) <= 5) && (
                <PaginationItem key={index} className={index + 1 === currentPage ? "active" : ""}>
                <PaginationLink
                    href="#pablo"
                    onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                    }}
                >
                    {index + 1}
                </PaginationLink>
                </PaginationItem>
            )
            )
        )}
        <PaginationItem className={currentPage === Math.ceil(data.length / itemsPerPage) ? "disabled" : ""}>
            <PaginationLink
            href="#pablo"
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage + 1);
            }}
            >
            <i className="fas fa-angle-right" />
            <span className="sr-only">Next</span>
            </PaginationLink>
        </PaginationItem>
        </Pagination>

    </nav>
  </CardFooter>

              </Card>
            </div>
          </Row>
        </Container>

        <Modal isOpen={modalAdd} toggle={toggleAdd}>
          <ModalHeader toggle={toggleAdd}>إضافة</ModalHeader>
          <ModalBody>
              <Form onSubmit={handleFormSubmit}>
                <FormGroup>
                <Label for="region">المنطقة</Label>
                <Input
                  type="text"
                  name="region"
                  id="region"
                  placeholder="ادخل المنطقة"
                  value={isEditMode ? editFormData.region || '' : formData.region || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, region: e.target.value });
                    } else {
                      setFormData({ ...formData, region: e.target.value });
                    }
                  }}
                />
                </FormGroup>
                <FormGroup>
                  <Label for="situation">الوضعية</Label>
                  <Input
                    type="text"
                    name="situation"
                    id="situation"
                    placeholder="ادخل الوضعية"
                    value={isEditMode ? editFormData.situation || '' : formData.situation || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, situation: e.target.value });
                      } else {
                        setFormData({ ...formData, situation: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="responsible">مسؤول المنطقة</Label>
                  <Input
                    type="text"
                    name="responsible"
                    id="responsible"
                    placeholder="ادخل مسؤول المنطقة"
                    value={isEditMode ? editFormData.responsible || '' : formData.responsible || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, responsible: e.target.value });
                      } else {
                        setFormData({ ...formData, responsible: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="widowName">اسم الأرملة</Label>
                  <Input
                    type="text"
                    name="widowName"
                    id="widowName"
                    placeholder="ادخل اسم الأرملة"
                    value={isEditMode ? editFormData.widowName || '' : formData.widowName || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, widowName: e.target.value });
                      } else {
                        setFormData({ ...formData, widowName: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="widowBirthDate">تاريخ ازدياد الأرملة</Label>
                  <Input
                    type="date"
                    name="widowBirthDate"
                    id="widowBirthDate"
                    placeholder="ادخل تاريخ ازدياد الأرملة"
                    value={isEditMode ? editFormData.widowBirthDate || '' : formData.widowBirthDate}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, widowBirthDate: e.target.value });
                      } else {
                        setFormData({ ...formData, widowBirthDate: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="nationalId">رقم البطاقة الوطنية للأرملة</Label>
                  <Input
                    type="text"
                    name="nationalId"
                    id="nationalId"
                    placeholder="ادخل رقم البطاقة الوطنية للأرملة"
                    value={isEditMode ? editFormData.nationalId || '' : formData.nationalId || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, nationalId: e.target.value });
                      } else {
                        setFormData({ ...formData, nationalId: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="widowOccupation">مهنة الأرملة</Label>
                  <Input
                    type="text"
                    name="widowOccupation"
                    id="widowOccupation"
                    placeholder="ادخل مهنة الأرملة"
                    value={isEditMode ? editFormData.widowOccupation || '' : formData.widowOccupation || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, widowOccupation: e.target.value });
                      } else {
                        setFormData({ ...formData, widowOccupation: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="widowHealthStatus">الوضعية الصحية للأرملة</Label>
                  <Input
                    type="text"
                    name="widowHealthStatus"
                    id="widowHealthStatus"
                    placeholder="ادخل الوضعية الصحية للأرملة"
                    value={isEditMode ? editFormData.widowHealthStatus || '' : formData.widowHealthStatus || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, widowHealthStatus: e.target.value });
                      } else {
                        setFormData({ ...formData, widowHealthStatus: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="governmentSupport">الدعم الحكومي/التغطية الاجتماعية</Label>
                  <Input
                    type="text"
                    name="governmentSupport"
                    id="governmentSupport"
                    placeholder="ادخل الدعم الحكومي/التغطية الاجتماعية"
                    value={isEditMode ? editFormData.governmentSupport || '' : formData.governmentSupport || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, governmentSupport: e.target.value });
                      } else {
                        setFormData({ ...formData, governmentSupport: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="deathDate">تاريخ وفاة الهالك</Label>
                  <Input
                    type="date"
                    name="deathDate"
                    id="deathDate"
                    placeholder="ادخل تاريخ وفاة الهالك"
                    value={isEditMode ? editFormData.deathDate || '' : formData.deathDate || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, deathDate: e.target.value });
                      } else {
                        setFormData({ ...formData, deathDate: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="orphanLastName">الاسم العائلي لليتيم</Label>
                  <Input
                    type="text"
                    name="orphanLastName"
                    id="orphanLastName"
                    placeholder="ادخل الاسم العائلي لليتيم"
                    value={isEditMode ? editFormData.orphanLastName || '' : formData.orphanLastName || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, orphanLastName: e.target.value });
                      } else {
                        setFormData({ ...formData, orphanLastName: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="orphanFirstName">الاسم الشخصي لليتيم</Label>
                  <Input
                    type="text"
                    name="orphanFirstName"
                    id="orphanFirstName"
                    placeholder="ادخل الاسم الشخصي لليتيم"
                    value={isEditMode ? editFormData.orphanFirstName || '' : formData.orphanFirstName || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, orphanFirstName: e.target.value });
                      } else {
                        setFormData({ ...formData, orphanFirstName: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="address">العنوان</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="ادخل العنوان"
                    value={isEditMode ? editFormData.address || '' : formData.address || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, address: e.target.value });
                      } else {
                        setFormData({ ...formData, address: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="phone">الهاتف</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="ادخل الهاتف"
                    value={isEditMode ? editFormData.phone || '' : formData.phone || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, phone: e.target.value });
                      } else {
                        setFormData({ ...formData, phone: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="notes">ملاحظات</Label>
                  <Input
                    type="text"
                    name="notes"
                    id="notes"
                    placeholder="ادخل ملاحظات"
                    value={isEditMode ? editFormData.notes || '' : formData.notes || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, notes: e.target.value });
                      } else {
                        setFormData({ ...formData, notes: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="committeeNotes">ملاحظات / قرار اللجنة</Label>
                  <Input
                    type="text"
                    name="committeeNotes"
                    id="committeeNotes"
                    placeholder="ادخل ملاحظات / قرار اللجنة"
                    value={isEditMode ? editFormData.committeeNotes || '' : formData.committeeNotes || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, committeeNotes: e.target.value });
                      } else {
                        setFormData({ ...formData, committeeNotes: e.target.value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="decisionDate">تاريخ القرار</Label>
                  <Input
                    type="date"
                    name="decisionDate"
                    id="decisionDate"
                    placeholder="ادخل تاريخ القرار"
                    value={isEditMode ? editFormData.decisionDate || '' : formData.decisionDate || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, decisionDate: e.target.value });
                      } else {
                        setFormData({ ...formData, decisionDate: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="updateDate">تاريخ التحيين</Label>
                  <Input
                    type="date"
                    name="updateDate"
                    id="updateDate"
                    placeholder="ادخل تاريخ التحيين"
                    value={isEditMode ? editFormData.updateDate || '' : formData.updateDate || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, updateDate: e.target.value });
                      } else {
                        setFormData({ ...formData, updateDate: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="support">المساعدات</Label>
                  <Input
                    type="text"
                    name="support"
                    id="support"
                    placeholder="ادخل المساعدات"
                    value={isEditMode ? editFormData.support || '' : formData.support || ''}
                    onChange={(e) => {
                      if (isEditMode) {
                        setEditFormData({ ...editFormData, support: e.target.value });
                      } else {
                        setFormData({ ...formData, support: e.target.value });
                      }
                    }}
                  />
                </FormGroup>

              </Form>
              {notification && (
                <Alert color={notification.type} toggle={() => setNotification(null)}>
                  {notification.message}
                </Alert>
              )}



          </ModalBody>
          <ModalFooter>
            {isEditMode ? (
              <Button color="primary" type="submit" onClick={handleUpdate}>
                حفظ التعديلات
              </Button>
            ) : (
              <Button color="primary" type="submit" onClick={handleFormSubmit}>
                حفظ
              </Button>
            )}
            <Button color="secondary" onClick={toggleAdd}>
              إلغاء
            </Button>
          </ModalFooter>


        </Modal>
      </>
    );
  };

  export default RelationSoc;