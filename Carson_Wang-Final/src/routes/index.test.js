import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Comment from './comment';
import Planning from './planning';
import Saved from './save';
import Details from './details';
import MainPage from './index';
import SavedResorts from './saveResorts';

describe('Handle Input Change for Two Forms', () => {
    test('handles input changes for plan the Comment', () => {
        const { getByTestId } = render(<Comment />);

        const nameInput = getByTestId('Name');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        const ratingInput = getByTestId('Rating');
        fireEvent.change(ratingInput, { target: { value: '4' } });
        const commentTextarea = getByTestId('Trip-Notes');
        fireEvent.change(commentTextarea, { target: { value: 'Great trip!' } });
        fireEvent.click(getByTestId('Submit-Review'))

        expect(ratingInput.value).toBe('4');
        expect(nameInput.value).toBe('John Doe');
        expect(commentTextarea.value).toBe('Great trip!');
    });

    test('handles input changes for plan the trip', () => {
        const { getByTestId } = render(<Planning />);

        fireEvent.change(getByTestId("snow-season-input"), { target: { value: "2023" } });
        fireEvent.change(getByTestId("start-date-input"), { target: { value: "2023-01-01" } });
        fireEvent.change(getByTestId("end-date-input"), { target: { value: "2023-01-07" } });
        fireEvent.change(getByTestId("resort-select"), { target: { value: "Northstar" } });
        fireEvent.change(getByTestId("trip-notes-textarea"), { target: { value: "Excited for this trip!" } });

        expect(getByTestId("snow-season-input").value).toBe("2023");
        expect(getByTestId("start-date-input").value).toBe("2023-01-01");
        expect(getByTestId("end-date-input").value).toBe("2023-01-07");
        expect(getByTestId("resort-select").value).toBe("Northstar");
        expect(getByTestId("trip-notes-textarea").value).toBe("Excited for this trip!");
    });
});

describe('Saved component', () => {
    const unmockedFetch = global.fetch

    beforeAll(() => {
        global.fetch = () =>
            Promise.resolve({
                json: () => Promise.resolve([{
                    "Resort": "Keystone",
                    "Ski Pass": "Epic",
                    "Location (State)": "Colorado",
                    "Days Open This Season": 170,
                    "Avg Total Snowfall (inches)": 210,
                    "Beginner Runs": 26,
                    "Intermediate Runs": 43,
                    "Advanced Runs": 66,
                    "Expert Runs": "",
                    "Lift Amount": 20,
                    "Skiable Terrain (Acres)": "3,149",
                    "Top Elevation (ft)": "12,408",
                    "Total Runs": 135
                },
                {
                    "Resort": "Breckenridge",
                    "Ski Pass": "Epic",
                    "Location (State)": "Colorado",
                    "Days Open This Season": 199,
                    "Avg Total Snowfall (inches)": 355,
                    "Beginner Runs": 25,
                    "Intermediate Runs": 43,
                    "Advanced Runs": 67,
                    "Expert Runs": 52,
                    "Lift Amount": 35,
                    "Skiable Terrain (Acres)": 2908,
                    "Top Elevation (ft)": "12,998",
                    "Total Runs": 187
                },
                {
                    "Resort": "Vail",
                    "Ski Pass": "Epic",
                    "Location (State)": "Colorado",
                    "Days Open This Season": 160,
                    "Avg Total Snowfall (inches)": 354,
                    "Beginner Runs": 63,
                    "Intermediate Runs": 96,
                    "Advanced Runs": 110,
                    "Expert Runs": 5,
                    "Lift Amount": 31,
                    "Skiable Terrain (Acres)": 5317,
                    "Top Elevation (ft)": 11570,
                    "Total Runs": 275
                }]),
            })
    })

    afterAll(() => {
        global.fetch = unmockedFetch
    })

    test('renders "Save Resort" button initially when not saved', async () => {
        render(<Saved resortName="Breckenridge" />);
        await waitFor(() => {
            const saveButton = screen.getByText('Save Resort');
            expect(saveButton).toBeInTheDocument();
        });
    });

    test('renders "Unsave Resort" button initially when saved', async () => {
        render(<Saved resortName="Breckenridge" />);

        await waitFor(() => {
            const unsaveButton = screen.getByText('Unsave Resort');
            expect(unsaveButton).toBeInTheDocument();
        });
    });

    test('toggles between "Save Resort" and "Unsave Resort" on button click', async () => {
        render(<Saved resortName="Breckenridge" />);

        await waitFor(() => {
            const saveButton = screen.getByText('Save Resort');
            expect(saveButton).toBeInTheDocument();
        });

        const button = screen.getByText('Save Resort');
        fireEvent.click(button);

        await waitFor(() => {
            const unsaveButton = screen.getByText('Unsave Resort');
            expect(unsaveButton).toBeInTheDocument();
        });
    });
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: jest.fn(),
}));

describe('Details component', () => {
    const mockResortDetails = {
        "Resort": "Vail",
        "Ski Pass": "Epic",
        "Location (State)": "Colorado",
        "Days Open This Season": 160,
        "Avg Total Snowfall (inches)": 354,
        "Beginner Runs": 63,
        "Intermediate Runs": 96,
        "Advanced Runs": 110,
        "Expert Runs": 5,
        "Lift Amount": 31,
        "Skiable Terrain (Acres)": 5317,
        "Top Elevation (ft)": 11570,
        "Total Runs": 275
    };

    test('renders details for a resort with an Epic pass', () => {
        useLoaderData.mockReturnValue(mockResortDetails);

        render(
            <MemoryRouter>
                <Details />
            </MemoryRouter>
        );

        expect(screen.getByText('Vail, a member of')).toBeInTheDocument();
        expect(screen.getByText('Colorado')).toBeInTheDocument();
        expect(screen.getByText(160)).toBeInTheDocument();
        expect(screen.getByText(354)).toBeInTheDocument();
        expect(screen.getByText(11570)).toBeInTheDocument();
    });
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: jest.fn(),
}));

describe('MainPage component', () => {
    const mockResortData = [
        { "Resort": "Snowy Peaks", "Ski Pass": "Epic", "Location (State)": "Colorado" },
        { "Resort": "Snowy Summit", "Ski Pass": "Ikon", "Location (State)": "California" },
    ];

    beforeEach(() => {
        useLoaderData.mockReturnValue(mockResortData);
    });

    test('renders the component with initial state', () => {
        render(
            <MemoryRouter>
                <MainPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText('Search to find your ideal resort...')).toBeInTheDocument();
    });

    test('updates the resort list on search term change', () => {
        render(
            <MemoryRouter>
                <MainPage />
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText('Search for a resort...');
        fireEvent.change(searchInput, { target: { value: 'Snowy' } });

        expect(screen.getByText('Snowy Peaks')).toBeInTheDocument();
    });
});


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: jest.fn(),
}));

describe('SavedResorts component', () => {
    const mockResortData = [
        { id: 1, "Resort": "Alpine Meadows", "Location (State)": "California" },
        { id: 2, "Resort": "Boreal", "Location (State)": "California" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );
        useLoaderData.mockReturnValue(mockResortData);
    });

    test('renders with sorted resorts', () => {
        render(
            <MemoryRouter>
                <SavedResorts />
            </MemoryRouter>
        );

        expect(screen.getByText('Alpine Meadows in California')).toBeInTheDocument();
        expect(screen.getByText('Boreal in California')).toBeInTheDocument();
    });

    test('removes a resort on delete', async () => {
        render(
            <MemoryRouter>
                <SavedResorts />
            </MemoryRouter>
        );

        fetch.mockImplementationOnce(() => Promise.resolve({ ok: true }));

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.queryByText('Alpine Meadows in California')).not.toBeInTheDocument();
        });
    });
});