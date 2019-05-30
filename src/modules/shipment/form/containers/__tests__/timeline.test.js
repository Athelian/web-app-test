import faker from 'faker';
import Timeline, { initValues } from '../timeline';

describe('shipment timeline container', () => {
  it('should init empty array on creation', () => {
    const container = new Timeline();
    expect(container.state).toEqual(initValues);
  });

  it('should not change the data if timeline is empty', async () => {
    const container = new Timeline();
    const group = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    await container.onChangePartner(group);

    expect(container.state).toEqual(initValues);
  });

  it('should reset cargo ready when change importer', async () => {
    const container = new Timeline();
    const group = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    const staff = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group,
    };

    const remainUsers = [
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
    ];

    const cargoReady = {
      id: faker.random.uuid(),
      date: null,
      assignedTo: [staff, ...remainUsers],
      approvedBy: staff,
      approvedAt: faker.date.future(),
      timelineDateRevisions: [
        {
          id: faker.random.uuid(),
          date: faker.date.future(),
          type: 'Other',
          memo: null,
        },
      ],
    };
    const containerGroup = {};
    const voyage = {};

    await container.initDetailValues({
      cargoReady,
      containerGroups: [containerGroup],
      voyages: [voyage],
    });

    expect(container.state).toEqual({
      cargoReady,
      containerGroups: [containerGroup],
      voyages: [voyage],
    });

    await container.onChangePartner(group);

    expect(container.state).toEqual({
      cargoReady: {
        ...cargoReady,
        assignedTo: remainUsers,
        approvedBy: null,
        approvedAt: null,
      },
      containerGroups: [containerGroup],
      voyages: [voyage],
    });
  });

  it('should reset status and remove staff when change importer ', async () => {
    const container = new Timeline();
    const group = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    const staff = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      group,
    };

    const remainUsers = [
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
      {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        group: {
          id: faker.random.uuid(),
          name: faker.name.findName(),
        },
      },
    ];

    const cargoReady = {
      id: faker.random.uuid(),
      date: null,
      assignedTo: [staff, ...remainUsers],
      approvedBy: staff,
      approvedAt: faker.date.future(),
      timelineDateRevisions: [
        {
          id: faker.random.uuid(),
          date: faker.date.future(),
          type: 'Other',
          memo: null,
        },
      ],
    };
    const containerGroup = {
      id: faker.random.uuid(),
      warehouse: null,
      customClearance: {
        id: faker.random.uuid(),
        assignedTo: [staff],
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      warehouseArrival: {
        id: faker.random.uuid(),
        date: null,
        assignedTo: [],
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      deliveryReady: {
        id: faker.random.uuid(),
        assignedTo: [],
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
    };
    const voyage = {
      id: faker.random.uuid(),
      vesselName: null,
      vesselCode: null,
      departurePort: {
        seaport: null,
        airport: null,
      },
      arrivalPort: {
        seaport: null,
        airport: null,
      },
      departure: {
        id: faker.random.uuid(),
        date: null,
        assignedTo: [],
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      arrival: {
        id: faker.random.uuid(),
        date: null,
        assignedTo: [],
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
    };

    await container.initDetailValues({
      cargoReady,
      containerGroups: [containerGroup],
      voyages: [voyage],
    });

    await container.onChangePartner(group);

    expect(container.state).toEqual({
      cargoReady: {
        ...cargoReady,
        assignedTo: remainUsers,
        approvedBy: null,
        approvedAt: null,
      },
      containerGroups: [
        {
          ...containerGroup,
          customClearance: {
            ...containerGroup.customClearance,
            assignedTo: [],
            approvedBy: null,
            approvedAt: null,
          },
          warehouseArrival: {
            ...containerGroup.warehouseArrival,
            approvedBy: null,
            approvedAt: null,
          },
          deliveryReady: {
            ...containerGroup.deliveryReady,
            approvedBy: null,
            approvedAt: null,
          },
        },
      ],
      voyages: [
        {
          ...voyage,
          departure: {
            ...voyage.departure,
            approvedBy: null,
            approvedAt: null,
          },
          arrival: {
            ...voyage.arrival,
            approvedBy: null,
            approvedAt: null,
          },
        },
      ],
    });
  });
});
