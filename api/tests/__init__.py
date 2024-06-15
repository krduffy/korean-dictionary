import unittest

def load_tests(loader, standard_tests, pattern):
    suite = unittest.TestSuite()
    for all_test_suite in unittest.defaultTestLoader.discover('api.tests', pattern='test*.py'):
        for test_suite in all_test_suite:
            suite.addTests(test_suite)
    return suite