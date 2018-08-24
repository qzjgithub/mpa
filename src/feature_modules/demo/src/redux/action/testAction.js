export const TEST_SET = "TEST_SET";
export function testAction(data) {
    return {
        type: TEST_SET,
        data: data
    };
}