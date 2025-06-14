import React, { useState, useEffect } from 'react';
import './ActivityForm.css';
import axiosInstance from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActivityForm = ({ onActivityAdded }) => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    activity_type: '',
    activity_name: '',
    hours: '0',
    minutes: '0',
    seconds: '0',
    date: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    document.title = isEdit
      ? `Editing: ${formData.activity_name || 'Activity'} | Activity Tracker`
      : 'Add Activity | Activity Tracker';
  }, [formData.activity_name, isEdit]);

  useEffect(() => {
    if (isEdit && id) {
      axiosInstance.get(`/api/activities/${id}/`)
        .then(response => {
          const data = response.data;
          const totalSeconds = parseInt(data.duration, 10);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          setFormData({
            activity_type: data.activity_type,
            activity_name: data.activity_name,
            hours: hours.toString(),
            minutes: minutes.toString(),
            seconds: seconds.toString(),
            date: data.date,
            notes: data.notes || '',
          });
        })
        .catch(err => {
          console.error("Failed to fetch activity:", err);
          setErrors(prev => ({ ...prev, global: "Could not load activity data." }));
        });
    }
  }, [isEdit, id]);

  const validateField = (name, value) => {
    let message = "";

    if (name === "activity_type" && !value) message = "Please select an activity type.";
    if (name === "activity_name" && !value.trim()) message = "Activity name is required.";
    if (name === "date" && !value) message = "Date is required.";
    if (name === "date" && value > today) message = "You can't add activities in the future.";

    return message;
  };

  const validateDuration = (hours, minutes, seconds) => {
    const total = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    return total <= 0 ? "Please select a non-zero duration." : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    const fieldError = validateField(name, value);
    const durationError = validateDuration(
      updatedFormData.hours,
      updatedFormData.minutes,
      updatedFormData.seconds
    );

    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
      duration: durationError,
    }));

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fieldErrors = {
      activity_type: validateField("activity_type", formData.activity_type),
      activity_name: validateField("activity_name", formData.activity_name),
      date: validateField("date", formData.date),
      duration: validateDuration(formData.hours, formData.minutes, formData.seconds),
    };

    const hasErrors = Object.values(fieldErrors).some(msg => msg);
    if (hasErrors) {
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const { hours, minutes, seconds, ...rest } = formData;
    const duration = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    const payload = { ...rest, duration };


    const token = localStorage.getItem("authToken");

    try {
      console.log("📤 Payload to be sent to backend:", payload);
      let response;
      if (isEdit) {
        response = await axiosInstance.put(
          `/api/activities/${id}/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("✅ Activity updated successfully!");
      } else {
        response = await axiosInstance.post(
          '/api/activities/',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("✅ New activity saved successfully!");
        if (onActivityAdded) onActivityAdded(response.data);
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error('Error saving activity:', err);
      toast.error("❌ Failed to save activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <ToastContainer />
      <form className="activity-form" onSubmit={handleSubmit}>
        <h2>{isEdit ? "Edit Activity" : "Add Activity"}</h2>

        {errors.global && <div className="error-message text-danger mb-3">{errors.global}</div>}

        <div className="form-group mb-3">
          <label htmlFor="activity_type">Activity Type</label>
          <select
            className="form-select"
            id="activity_type"
            name="activity_type"
            value={formData.activity_type}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Activity --</option>
            <option value="walking">Walking</option>
            <option value="running">Running</option>
            <option value="hiking">Hiking</option>
            <option value="cycling">Cycling</option>
            <option value="swimming">Swimming</option>
            <option value="gym">Gym</option>
            <option value="crossfit">CrossFit</option>
            <option value="yoga">Yoga</option>
            <option value="dancing">Dancing</option>
          </select>
          {errors.activity_type && <div className="text-danger small">{errors.activity_type}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="activity_name">Activity Name</label>
          <input
            type="text"
            className="form-control"
            id="activity_name"
            name="activity_name"
            value={formData.activity_name}
            onChange={handleChange}
            required
          />
          {errors.activity_name && <div className="text-danger small">{errors.activity_name}</div>}
        </div>

        <label>Duration</label>
        <div className="row mb-1">
          <div className="col">
            <select className="form-select" name="hours" value={formData.hours} onChange={handleChange}>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i} hr</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" name="minutes" value={formData.minutes} onChange={handleChange}>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>{i} min</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" name="seconds" value={formData.seconds} onChange={handleChange}>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>{i} sec</option>
              ))}
            </select>
          </div>
        </div>
        {errors.duration && <div className="text-danger small mb-3">{errors.duration}</div>}

        <div className="form-group mb-3">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            max={today}
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <div className="text-danger small">{errors.date}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="notes">Notes</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Activity' : 'Save Activity'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default ActivityForm;
