import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function Comments({ resortName }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [authorError, setAuthorError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [commentError, setCommentError] = useState('');

  const validate = () => {
    let isValid = true;

    if (!author.trim()) {
      setAuthorError('Name is required.');
      isValid = false;
    } else {
      setAuthorError('');
    }

    const numericRating = parseFloat(rating);
    if (!rating.trim()) {
      setRatingError('Rating is required.');
      isValid = false;
    } else if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setRatingError('Rating must be a number between 1 and 5.');
      isValid = false;
    } else {
      setRatingError('');
    }

    if (!comment.trim()) {
      setCommentError('Comment is required.');
      isValid = false;
    } else {
      setCommentError('');
    }

    return isValid;
  };

  useEffect(() => {
    fetch(`http://localhost:3000/reviews?resortName=${encodeURIComponent(resortName)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setReviews(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setIsLoading(false);
      });
  }, [resortName]);

  const sortedReviews = reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidForm = validate();

    if (isValidForm) {
      setSubmitting(true);
      setError('');

      const newReview = {
        resortName,
        author,
        comment,
        rating: parseInt(rating, 10),
        timestamp: new Date().toISOString()
      };

      try {
        const response = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReview),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const addedReview = await response.json();
        setReviews([addedReview, ...reviews]);

        toast("You have successfully submitted a comment!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          type: toast.TYPE.DEFAULT
        });

        setAuthor('');
        setComment('');
        setRating('');
      } catch (error) {
        console.error('Error posting review:', error);
        setError('An error occurred while submitting the review.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div>
      <h6>Reviews for {resortName}</h6>
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : (
        sortedReviews.length > 0 ? (
          <ul className="list-group list-group-flush">
            {sortedReviews.map((review, index) => {
              const reviewDate = new Date(review.timestamp);
              const dateString = reviewDate.toLocaleDateString();
              const timeString = reviewDate.toLocaleTimeString();
              return (
                <li key={index} className="list-group-item">
                  <p><strong data-testid="result">{review.author}</strong> ({dateString} at {timeString}) wrote:</p>
                  <p data-testid="result2">{review.comment}</p>
                  <p data-testid="result3">Rating: {review.rating} / 5</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No reviews available for this resort.</p>
        )
      )}

      <hr />
      <div>
        <h6>Have a thought? Add a review...</h6>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-3">
              Name:
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                data-testid="Name"
              />
              {authorError && <div className="error">{authorError}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-2">
              Rating
              <input
                type="number"
                className="form-control"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                data-testid="Rating"
              />
              {ratingError && <div className="error">{ratingError}</div>}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="exampleFormControlTextarea4" className="form-label">Trip Notes:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-control"
              id="exampleFormControlTextarea4"
              rows="3"
              data-testid="Trip-Notes"
            />
            {commentError && <div className="error">{commentError}</div>}
          </div>

          <div className="form-row">
            <button type="submit" className="btn btn-light" data-testid="Submit-Review">Submit Review</button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
