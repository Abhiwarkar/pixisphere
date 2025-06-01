import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  selectInquiryModal, 
  closeInquiryModal, 
  addNotification,
  setComponentLoading,
  selectComponentLoading 
} from '../../redux/uiSlice';

const InquiryForm = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectInquiryModal);
  const loading = useSelector(selectComponentLoading);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    guestCount: '',
    budget: '',
    message: '',
  });

  const eventTypes = [
    'Wedding',
    'Pre-wedding',
    'Maternity',
    'Newborn',
    'Birthday',
    'Family Portrait',
    'Corporate Event',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(setComponentLoading({ component: 'inquirySubmit', loading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Inquiry Sent!',
        message: 'Your inquiry has been sent successfully. The photographer will contact you soon.',
      }));
      
      dispatch(closeInquiryModal());
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        location: '',
        guestCount: '',
        budget: '',
        message: '',
      });
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to send inquiry. Please try again.',
      }));
    } finally {
      dispatch(setComponentLoading({ component: 'inquirySubmit', loading: false }));
    }
  };

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={() => dispatch(closeInquiryModal())}
        disabled={loading.inquirySubmit}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="inquiry-form"
        loading={loading.inquirySubmit}
      >
        Send Inquiry
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={() => dispatch(closeInquiryModal())}
      title="Send Inquiry"
      size="lg"
      footer={footer}
    >
      <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="+91 12345 67890"
          />
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <MessageSquare size={16} className="inline mr-1" />
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Event Date *
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Event Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="City, venue, or address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <Users size={16} className="inline mr-1" />
              Guest Count (approx.)
            </label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              className="input-field"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select budget range</option>
              <option value="under-10k">Under ₹10,000</option>
              <option value="10k-25k">₹10,000 - ₹25,000</option>
              <option value="25k-50k">₹25,000 - ₹50,000</option>
              <option value="50k-100k">₹50,000 - ₹1,00,000</option>
              <option value="above-100k">Above ₹1,00,000</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Additional Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Tell us more about your event, special requirements, or any questions you have..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default InquiryForm;