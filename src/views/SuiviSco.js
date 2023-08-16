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

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Apply search filter to the entire dataset
    const filteredResults = data.filter(item => {
        const searchFields = ['region', 'situation', 'responsible', 'widowName', 'widowBirthDate', 'nationalId', 'widowOccupation', 'widowHealthStatus', 'governmentSupport', 'deathDate', 'orphanLastName', 'orphanFirstName', 'educationLevel2023_2022', 'employer', 'section', 'course1Score', 'overallScore', 'transferStatus', 'educationLevel2023_2024', 'address', 'phone', 'committeeNotes', 'decisionDate', 'updateDate', 'support'];
        const searchQueryLower = searchQuery.toLowerCase();
  
      // Check if any of the search fields contain the search query
      return searchFields.some(field => {
        const fieldValue = item[field] || '';
        const fieldValueLower = fieldValue.toLowerCase();
        return fieldValueLower.includes(searchQueryLower);
      });
    });
  
    // Update the filtered data state with the search results
    setFilteredData(filteredResults);
  }, [searchQuery, data]);



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
                      <Button color="success" className="mr-2" onClick={() => {
                      if (selectedRow) {
                        setIsEditMode(true);
                        setEditFormData(selectedRow);
                        toggleAdd();
                      } else {
                        // Show a message indicating that a row should be selected first
                      }
                    }}>
                      إدخال المعطيات الدراسية
                    </Button>
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
                {filteredData
    .sort((a, b) => {
      if (sortBy === 'asc') {
        return a[sortColumn].localeCompare(b[sortColumn]);
      } else if (sortBy === 'desc') {
        return b[sortColumn].localeCompare(a[sortColumn]);
      }
      return 0;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
  <Label for="orphanLastName">الاسم العائلي لليتيم</Label>
  <Input
    type="text"
    name="orphanLastName"
    id="orphanLastName"
    placeholder="ادخل الاسم العائلي لليتيم"
    value={isEditMode ? editFormData.orphanLastName || '' : formData.orphanLastName || ''}
    readOnly // Make the input field read-only
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
    readOnly // Make the input field read-only
  />
</FormGroup>

              <FormGroup>
                <Label for="educationLevel2023_2022">النوع / المستوى الدراسي 2023/2022</Label>
                <Input
                  type="text"
                  name="educationLevel2023_2022"
                  id="educationLevel2023_2022"
                  placeholder="ادخل النوع / المستوى الدراسي 2023/2022"
                  value={isEditMode ? editFormData.educationLevel2023_2022 || '' : formData.educationLevel2023_2022 || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, educationLevel2023_2022: e.target.value });
                    } else {
                      setFormData({ ...formData, educationLevel2023_2022: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="employer">المشغل / المؤسسة</Label>
                <Input
                  type="text"
                  name="employer"
                  id="employer"
                  placeholder="ادخل المشغل / المؤسسة"
                  value={isEditMode ? editFormData.employer || '' : formData.employer || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, employer: e.target.value });
                    } else {
                      setFormData({ ...formData, employer: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="section">الشعبة</Label>
                <Input
                  type="text"
                  name="section"
                  id="section"
                  placeholder="ادخل الشعبة"
                  value={isEditMode ? editFormData.section || '' : formData.section || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, section: e.target.value });
                    } else {
                      setFormData({ ...formData, section: e.target.value });
                    }
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="course1Score">معدل الدورة 1</Label>
                <Input
                  type="text"
                  name="course1Score"
                  id="course1Score"
                  placeholder="ادخل معدل الدورة 1"
                  value={isEditMode ? editFormData.course1Score || '' : formData.course1Score || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, course1Score: e.target.value });
                    } else {
                      setFormData({ ...formData, course1Score: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="exam1Score">معدل الامتحان الدورة 1</Label>
                <Input
                  type="text"
                  name="exam1Score"
                  id="exam1Score"
                  placeholder="ادخل معدل الامتحان الدورة 1"
                  value={isEditMode ? editFormData.exam1Score || '' : formData.exam1Score || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, exam1Score: e.target.value });
                    } else {
                      setFormData({ ...formData, exam1Score: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="course2Score">معدل الدورة 2</Label>
                <Input
                  type="text"
                  name="course2Score"
                  id="course2Score"
                  placeholder="ادخل معدل الدورة 2"
                  value={isEditMode ? editFormData.course2Score || '' : formData.course2Score || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, course2Score: e.target.value });
                    } else {
                      setFormData({ ...formData, course2Score: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="overallScore">المعدل العام</Label>
                <Input
                  type="text"
                  name="overallScore"
                  id="overallScore"
                  placeholder="ادخل المعدل العام"
                  value={isEditMode ? editFormData.overallScore || '' : formData.overallScore || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, overallScore: e.target.value });
                    } else {
                      setFormData({ ...formData, overallScore: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="transferStatus">ينتقل نعم/لا</Label>
                <Input
                  type="text"
                  name="transferStatus"
                  id="transferStatus"
                  placeholder="ادخل نعم/لا"
                  value={isEditMode ? editFormData.transferStatus || '' : formData.transferStatus || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, transferStatus: e.target.value });
                    } else {
                      setFormData({ ...formData, transferStatus: e.target.value });
                    }
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="educationLevel2023_2024">
                  /النوع /المستوى الدراسي 2023/2024
                </Label>
                <Input
                  type="text"
                  name="educationLevel2023_2024"
                  id="educationLevel2023_2024"
                  placeholder="ادخل النوع/المستوى الدراسي 2023/2024"
                  value={isEditMode ? editFormData.educationLevel2023_2024 || '' : formData.educationLevel2023_2024 || ''}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditFormData({ ...editFormData, educationLevel2023_2024: e.target.value });
                    } else {
                      setFormData({ ...formData, educationLevel2023_2024: e.target.value });
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